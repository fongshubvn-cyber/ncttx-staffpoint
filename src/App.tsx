import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SummaryView } from './components/SummaryView';
import { IncidentsView } from './components/IncidentsView';
import { StaffView } from './components/StaffView';
import { QuestionsView } from './components/QuestionsView';
import { BaselineView } from './components/BaselineView';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { GuideView } from './components/GuideView';
import { IncidentFormModal } from './components/IncidentFormModal';
import { LoginModal } from './components/LoginModal';
import { Option1Layout } from './components/option1/Option1Layout';

import { 
  Staff, 
  Question, 
  IncidentRecord, 
  IncidentType,
  DepartmentLine, 
  BaselinePoint, 
  ParameterConfig,
  AuthUser
} from './types';

import { 
  initialStaffList, 
  initialLines, 
  initialQuestions, 
  initialIncidents, 
  initialBaselinePoints, 
  defaultParameters 
} from './data/seedData';
import { isFirebaseConfigured, subscribeToCollection, saveToCloud } from './config/firebase';
import { isDeptHeadOrAboveRole } from './utils/calculator';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('summary'); // Default: Trang Tổng hợp
  const [isManager, setIsManager] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [showGlobalIncidentModal, setShowGlobalIncidentModal] = useState<boolean>(false);
  const [incidentModalTargetId, setIncidentModalTargetId] = useState<string | undefined>(undefined);
  const [incidentModalType, setIncidentModalType] = useState<IncidentType | undefined>(undefined);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [incidentsFilterType, setIncidentsFilterType] = useState<string>('all');

  const [uiOption, setUiOption] = useState<'default' | 'option1'>(() => {
    const saved = localStorage.getItem('ncttx_ui_option');
    return (saved === 'default' || saved === 'option1') ? saved : 'option1';
  });

  const handleToggleUiOption = () => {
    setUiOption(prev => {
      const next = prev === 'option1' ? 'default' : 'option1';
      localStorage.setItem('ncttx_ui_option', next);
      return next;
    });
  };

  const handleOpenIncidentModal = (targetId?: string, type?: IncidentType) => {
    setIncidentModalTargetId(targetId);
    setIncidentModalType(type);
    setShowGlobalIncidentModal(true);
  };

  // Authentication State with Persistence (Default null if not logged in)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('ncttx_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ncttx_user_passwords');
    return saved ? JSON.parse(saved) : {};
  });

  // State with LocalStorage Persistence
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('ncttx_staff_list');
    return saved ? JSON.parse(saved) : initialStaffList;
  });

  const [lines, setLines] = useState<DepartmentLine[]>(() => {
    const saved = localStorage.getItem('ncttx_lines');
    return saved ? JSON.parse(saved) : initialLines;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('ncttx_questions');
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    const saved = localStorage.getItem('ncttx_incidents');
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  const [baselinePoints] = useState<BaselinePoint[]>(initialBaselinePoints);
  const [params, setParams] = useState<ParameterConfig>(() => {
    const saved = localStorage.getItem('ncttx_params');
    return saved ? { ...defaultParameters, ...JSON.parse(saved) } : defaultParameters;
  });

  // Track which collections have completed initial Cloud load
  const isCloudLoadedRef = React.useRef<Record<string, boolean>>({});

  // FIREBASE REALTIME CLOUD SYNC
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubStaff = subscribeToCollection('staff_list', (data) => {
      isCloudLoadedRef.current['staff_list'] = true;
      if (Array.isArray(data) && data.length > 0) {
        setStaffList(data);
        localStorage.setItem('ncttx_staff_list', JSON.stringify(data));
      }
    }, initialStaffList);

    const unsubIncidents = subscribeToCollection('incidents', (data) => {
      isCloudLoadedRef.current['incidents'] = true;
      if (Array.isArray(data)) {
        setIncidents(data);
        localStorage.setItem('ncttx_incidents', JSON.stringify(data));
      }
    }, initialIncidents);

    const unsubQuestions = subscribeToCollection('questions', (data) => {
      isCloudLoadedRef.current['questions'] = true;
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        localStorage.setItem('ncttx_questions', JSON.stringify(data));
      }
    }, initialQuestions);

    const unsubParams = subscribeToCollection('params', (data) => {
      isCloudLoadedRef.current['params'] = true;
      if (data && typeof data === 'object') {
        setParams(prev => {
          const updated = { ...prev, ...data };
          localStorage.setItem('ncttx_params', JSON.stringify(updated));
          return updated;
        });
      }
    }, defaultParameters);

    const unsubPasswords = subscribeToCollection('user_passwords', (data) => {
      isCloudLoadedRef.current['user_passwords'] = true;
      if (data && typeof data === 'object') {
        setUserPasswords(prev => {
          const updated = { ...prev, ...data };
          localStorage.setItem('ncttx_user_passwords', JSON.stringify(updated));
          return updated;
        });
      }
    }, userPasswords);

    return () => {
      unsubStaff();
      unsubIncidents();
      unsubQuestions();
      unsubParams();
      unsubPasswords();
    };
  }, []);

  // Sync params to local storage
  useEffect(() => {
    localStorage.setItem('ncttx_params', JSON.stringify(params));
  }, [params]);

  // Sync isManager state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setIsManager(currentUser.isManager || currentUser.isAdmin || isDeptHeadOrAboveRole(currentUser));
      localStorage.setItem('ncttx_current_user', JSON.stringify(currentUser));
    } else {
      setIsManager(false);
      localStorage.removeItem('ncttx_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ncttx_user_passwords', JSON.stringify(userPasswords));
  }, [userPasswords]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ncttx_staff_list', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('ncttx_lines', JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    localStorage.setItem('ncttx_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('ncttx_incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Handler: Password update
  const handleUpdatePassword = (userId: string, newPass: string) => {
    const cleanId = userId.trim().toUpperCase();
    setUserPasswords(prev => {
      const updated = { ...prev, [cleanId]: newPass };
      localStorage.setItem('ncttx_user_passwords', JSON.stringify(updated));
      saveToCloud('user_passwords', updated);
      return updated;
    });
  };

  // Handler: Add new incident record
  const handleAddIncident = (newIncident: IncidentRecord) => {
    setIncidents(prev => {
      const updated = [newIncident, ...prev];
      localStorage.setItem('ncttx_incidents', JSON.stringify(updated));
      saveToCloud('incidents', updated);
      return updated;
    });
    if (newIncident.status === 'Đã duyệt' || newIncident.type === 'vi_pham') {
      applyIncidentScoreImpact(newIncident);
    }
  };

  // Handler: Staff sends 48h appeal for a violation
  const handleAppealIncident = (incidentId: string, reason: string) => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Đang kháng nghị' as const,
            appealReason: reason,
            appealDate: new Date().toISOString().split('T')[0],
            appealStatus: 'pending' as const,
          };
        }
        return inc;
      });
      localStorage.setItem('ncttx_incidents', JSON.stringify(updated));
      saveToCloud('incidents', updated);
      return updated;
    });
  };

  // Handler: HR Head resolves 48h appeal
  const handleResolveAppeal = (incidentId: string, approved: boolean) => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id === incidentId) {
          const newStatus = approved ? 'Kháng nghị được chấp nhận' as const : 'Kháng nghị bị từ chối' as const;
          if (approved && inc.type === 'vi_pham') {
            refundIncidentScoreImpact(inc);
          }
          return {
            ...inc,
            status: newStatus,
            appealStatus: approved ? ('approved' as const) : ('rejected' as const),
          };
        }
        return inc;
      });
      localStorage.setItem('ncttx_incidents', JSON.stringify(updated));
      saveToCloud('incidents', updated);
      return updated;
    });
  };

  // Helper: Safe number parser
  const safeNum = (val: any, fallback = 4.0): number => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Helper: Refund points upon approved appeal
  const refundIncidentScoreImpact = (incident: IncidentRecord) => {
    if (!incident || typeof incident.impactPoints !== 'number') return;
    const wGenMgmt = params?.weightGeneralWithMgmt ?? 0.35;
    const wMgmtMgmt = params?.weightMgmtWithMgmt ?? 0.30;
    const wTechMgmt = params?.weightTechWithMgmt ?? 0.35;
    const wGenNoMgmt = params?.weightGeneralNoMgmt ?? 0.50;
    const wTechNoMgmt = params?.weightTechNoMgmt ?? 0.50;

    setStaffList(prev => {
      const updated = prev.map(staff => {
        if (staff.id === incident.targetId) {
          const curGen = safeNum(staff.generalScore, 4.0);
          const curTech = safeNum(staff.techScore, 4.0);
          const curMgmt = safeNum(staff.mgmtScore, 4.0);
          const refundedPoints = Math.abs(safeNum(incident.impactPoints, 0));

          const newGeneralScore = Math.max(0, Math.min(5, Number((curGen + refundedPoints).toFixed(2))));
          let newTotalScore = 4.0;
          if (typeof staff.mgmtScore === 'number' && !isNaN(staff.mgmtScore)) {
            newTotalScore = Math.max(0, Math.min(5, Number((
              newGeneralScore * wGenMgmt + curMgmt * wMgmtMgmt + curTech * wTechMgmt
            ).toFixed(2))));
          } else {
            newTotalScore = Math.max(0, Math.min(5, Number((
              newGeneralScore * wGenNoMgmt + curTech * wTechNoMgmt
            ).toFixed(2))));
          }

          return {
            ...staff,
            generalScore: isNaN(newGeneralScore) ? 4.0 : newGeneralScore,
            totalScore: isNaN(newTotalScore) ? 4.0 : newTotalScore,
          };
        }
        return staff;
      });
      localStorage.setItem('ncttx_staff_list', JSON.stringify(updated));
      saveToCloud('staff_list', updated);
      return updated;
    });
  };

  // Handler: Manager updates incident approval status
  const handleUpdateIncidentStatus = (id: string, status: 'Đã duyệt' | 'Từ chối') => {
    setIncidents(prev => {
      const updatedList = prev.map(inc => {
        if (inc.id === id) {
          const updated = { ...inc, status };
          if (status === 'Đã duyệt') {
            applyIncidentScoreImpact(updated);
          }
          return updated;
        }
        return inc;
      });
      localStorage.setItem('ncttx_incidents', JSON.stringify(updatedList));
      saveToCloud('incidents', updatedList);
      return updatedList;
    });
  };

  // Helper: Apply score impact to target staff
  const applyIncidentScoreImpact = (incident: IncidentRecord) => {
    if (!incident || typeof incident.impactPoints !== 'number') return;
    const wGenMgmt = params?.weightGeneralWithMgmt ?? 0.35;
    const wMgmtMgmt = params?.weightMgmtWithMgmt ?? 0.30;
    const wTechMgmt = params?.weightTechWithMgmt ?? 0.35;
    const wGenNoMgmt = params?.weightGeneralNoMgmt ?? 0.50;
    const wTechNoMgmt = params?.weightTechNoMgmt ?? 0.50;

    setStaffList(prev => {
      const updated = prev.map(staff => {
        if (staff.id === incident.targetId) {
          const curGen = safeNum(staff.generalScore, 4.0);
          const curTech = safeNum(staff.techScore, 4.0);
          const curMgmt = safeNum(staff.mgmtScore, 4.0);
          const impact = safeNum(incident.impactPoints, 0);

          const newGeneralScore = Math.max(0, Math.min(5, Number((curGen + impact).toFixed(2))));
          let newTotalScore = 4.0;
          if (typeof staff.mgmtScore === 'number' && !isNaN(staff.mgmtScore)) {
            newTotalScore = Math.max(0, Math.min(5, Number((
              newGeneralScore * wGenMgmt + curMgmt * wMgmtMgmt + curTech * wTechMgmt
            ).toFixed(2))));
          } else {
            newTotalScore = Math.max(0, Math.min(5, Number((
              newGeneralScore * wGenNoMgmt + curTech * wTechNoMgmt
            ).toFixed(2))));
          }

          return {
            ...staff,
            generalScore: isNaN(newGeneralScore) ? 4.0 : newGeneralScore,
            totalScore: isNaN(newTotalScore) ? 4.0 : newTotalScore,
          };
        }
        return staff;
      });
      localStorage.setItem('ncttx_staff_list', JSON.stringify(updated));
      saveToCloud('staff_list', updated);
      return updated;
    });
  };

  // Handler: Add new staff member
  const handleAddStaff = (newStaff: Staff) => {
    setStaffList(prev => {
      const updated = [newStaff, ...prev];
      localStorage.setItem('ncttx_staff_list', JSON.stringify(updated));
      saveToCloud('staff_list', updated);
      return updated;
    });
  };

  // Handler: Add new question
  const handleAddQuestion = (newQuestion: Question) => {
    setQuestions(prev => {
      const updated = [newQuestion, ...prev];
      localStorage.setItem('ncttx_questions', JSON.stringify(updated));
      saveToCloud('questions', updated);
      return updated;
    });
    if (newQuestion.category === 'Phòng ban' && newQuestion.lineId) {
      setLines(prev => {
        const updatedLines = prev.map(line => {
          if (line.id === newQuestion.lineId) {
            return {
              ...line,
              status: '✅ đủ nội dung' as const,
              questionCount: (line.questionCount || 0) + 1,
            };
          }
          return line;
        });
        localStorage.setItem('ncttx_lines', JSON.stringify(updatedLines));
        saveToCloud('lines', updatedLines);
        return updatedLines;
      });
    }
  };

  // Handler: Delete question
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q.id !== questionId);
      localStorage.setItem('ncttx_questions', JSON.stringify(updated));
      saveToCloud('questions', updated);
      return updated;
    });
  };

  // IF NOT LOGGED IN: DISPLAY ONLY THE STANDALONE LOGIN GATE!
  if (!currentUser) {
    return (
      <LoginModal
        isOpen={true}
        isStandalone={true}
        onClose={() => {}}
        staffList={staffList}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        userPasswords={userPasswords}
        onUpdatePassword={handleUpdatePassword}
      />
    );
  }

  if (uiOption === 'option1') {
    return (
      <>
        <Option1Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          staffList={staffList}
          incidents={incidents}
          questions={questions}
          lines={lines}
          params={params}
          currentUser={currentUser}
          isManager={isManager}
          onOpenIncidentModal={handleOpenIncidentModal}
          onOpenLoginModal={() => setShowLoginModal(true)}
          onLogout={() => setCurrentUser(null)}
          onAddStaff={handleAddStaff}
          onAddQuestion={handleAddQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onAddIncident={handleAddIncident}
          onUpdateStatus={handleUpdateIncidentStatus}
          onAppealIncident={handleAppealIncident}
          onResolveAppeal={handleResolveAppeal}
          uiOption={uiOption}
          onToggleUiOption={handleToggleUiOption}
        />

        <IncidentFormModal
          show={showGlobalIncidentModal}
          onClose={() => {
            setShowGlobalIncidentModal(false);
            setIncidentModalTargetId(undefined);
            setIncidentModalType(undefined);
          }}
          staffList={staffList}
          questions={questions}
          lines={lines}
          onAddIncident={handleAddIncident}
          isManager={isManager}
          initialTargetId={incidentModalTargetId}
          initialType={incidentModalType}
          params={params}
          currentUser={currentUser}
          onViewSubmittedList={() => {
            setActiveTab('incidents');
            setIncidentsFilterType('my_submitted');
          }}
        />

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          staffList={staffList}
          currentUser={currentUser}
          onLogin={(user) => setCurrentUser(user)}
          onLogout={() => {
            setCurrentUser(null);
            setShowLoginModal(false);
          }}
          userPasswords={userPasswords}
          onUpdatePassword={handleUpdatePassword}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEAE3] text-[#2D3748] flex items-center justify-center p-0 sm:p-4 font-sans">
      
      {/* Mobile Device Frame Wrapper */}
      <div className={isMobileFrame ? 'mobile-container w-full' : 'w-full max-w-5xl min-h-screen bg-[#EDEAE3]'}>
        
        {/* Header Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isManager={isManager}
          setIsManager={setIsManager}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          currentUser={currentUser}
          onOpenLoginModal={() => setShowLoginModal(true)}
          onLogout={() => {
            setCurrentUser(null);
            setShowLoginModal(false);
          }}
          incidents={incidents}
          uiOption={uiOption}
          onToggleUiOption={handleToggleUiOption}
        />

        {/* Main Mobile Body Content */}
        <main className="flex-1 p-4 space-y-4">
          
          {/* Section 1: "Tổng hợp" (Overview Dashboard) */}
          {activeTab === 'summary' && (
            <SummaryView
              staffList={staffList}
              incidents={incidents}
              questions={questions}
              params={params}
              onOpenIncidentModal={() => handleOpenIncidentModal()}
              isManager={isManager}
              currentUser={currentUser}
            />
          )}

          {/* Section 2: "Phiếu" (Incidents / Recognitions) */}
          {activeTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              staffList={staffList}
              questions={questions}
              onAddIncident={handleAddIncident}
              onUpdateStatus={handleUpdateIncidentStatus}
              isManager={isManager}
              onOpenIncidentModal={() => handleOpenIncidentModal()}
              currentUser={currentUser}
              onAppealIncident={handleAppealIncident}
              onResolveAppeal={handleResolveAppeal}
              initialFilterType={incidentsFilterType}
            />
          )}

          {/* Section 3: "Đội ngũ" */}
          {activeTab === 'staff' && (
            <StaffView
              staffList={staffList}
              lines={lines}
              onAddStaff={handleAddStaff}
              isManager={isManager}
              params={params}
              currentUser={currentUser}
              onOpenIncidentModal={handleOpenIncidentModal}
            />
          )}

          {/* Section 4: "Tiêu chí" */}
          {activeTab === 'questions' && (
            <QuestionsView
              questions={questions}
              lines={lines}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              isManager={isManager}
              currentUser={currentUser}
            />
          )}

          {/* Section 5: "Tham số" */}
          {activeTab === 'baseline' && (
            <BaselineView
              baselinePoints={baselinePoints}
              params={params}
              onUpdateParams={(newParams) => setParams(newParams)}
              currentUser={currentUser}
            />
          )}

          {/* Section 6: "Báo cáo" (Report & Analytics Dashboard - Restricted to Trưởng phòng & above) */}
          {activeTab === 'report' && (isDeptHeadOrAboveRole(currentUser) || isManager) && (
            <ReportView
              staffList={staffList}
              incidents={incidents}
              lines={lines}
              params={params}
              currentUser={currentUser}
              questions={questions}
            />
          )}

          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'guide' && <GuideView />}
        </main>

        {/* Global Incident Form Modal */}
        <IncidentFormModal
          show={showGlobalIncidentModal}
          onClose={() => {
            setShowGlobalIncidentModal(false);
            setIncidentModalTargetId(undefined);
            setIncidentModalType(undefined);
          }}
          staffList={staffList}
          questions={questions}
          lines={lines}
          onAddIncident={handleAddIncident}
          isManager={isManager}
          initialTargetId={incidentModalTargetId}
          initialType={incidentModalType}
          params={params}
          currentUser={currentUser}
          onViewSubmittedList={() => {
            setActiveTab('incidents');
            setIncidentsFilterType('my_submitted');
          }}
        />

        {/* Authentication & Password Change Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          staffList={staffList}
          currentUser={currentUser}
          onLogin={(user) => setCurrentUser(user)}
          onLogout={() => {
            setCurrentUser(null);
            setShowLoginModal(false);
          }}
          userPasswords={userPasswords}
          onUpdatePassword={handleUpdatePassword}
        />

      </div>

    </div>
  );
}

