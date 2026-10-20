import React, { useState, useEffect, useMemo } from 'react';
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
  IncidentStatus,
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
  defaultParameters,
  initialPolicyRules
} from './data/seedData';
import {
  isFirebaseConfigured,
  subscribeToCollection,
  saveToCloud,
  fetchDocFromCloud,
  saveIncidentAtomic,
  syncIncidentsToCloudAtomic
} from './config/firebase';
import {
  isDeptHeadOrAboveRole,
  isSystemAdmin,
  getStaffBaselineScores,
  getCalculatedBaselinePoints,
  calculateTotalScore,
  calculateSalaryTier,
  isManagementRole,
  getIncidentTargetPillar
} from './utils/calculator';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('summary'); // Default: Trang Tổng hợp
  const [isManager, setIsManager] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isRefreshingCloud, setIsRefreshingCloud] = useState<boolean>(false);
  const [showGlobalIncidentModal, setShowGlobalIncidentModal] = useState<boolean>(false);
  const [incidentModalTargetId, setIncidentModalTargetId] = useState<string | undefined>(undefined);
  const [incidentModalType, setIncidentModalType] = useState<IncidentType | undefined>(undefined);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [incidentsFilterType, setIncidentsFilterType] = useState<string>('all');

  const [uiOption, setUiOption] = useState<'default' | 'option1'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryUi = urlParams.get('ui');
      if (queryUi === 'option1' || queryUi === 'default') {
        localStorage.setItem('ncttx_ui_option', queryUi);
        return queryUi;
      }
    } catch (e) { }

    const saved = localStorage.getItem('ncttx_ui_option');
    return (saved === 'default' || saved === 'option1') ? saved : 'option1';
  });

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
    const rawList: Staff[] = saved ? JSON.parse(saved) : initialStaffList;
    const savedParamsRaw = localStorage.getItem('ncttx_params');
    const initialParams = savedParamsRaw ? { ...defaultParameters, ...JSON.parse(savedParamsRaw) } : defaultParameters;
    return rawList.map(st => {
      const baselines = getStaffBaselineScores(st, initialParams);
      return {
        ...st,
        generalScore: baselines.generalScore,
        techScore: baselines.techScore,
        mgmtScore: baselines.mgmtScore,
        totalScore: baselines.totalScore,
        salaryTier: baselines.salaryTier,
        hasCustomTechScore: false,
        hasCustomMgmtScore: false,
      };
    });
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

  const [params, setParams] = useState<ParameterConfig>(() => {
    const saved = localStorage.getItem('ncttx_params');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      ...defaultParameters,
      weightGeneralNoMgmt: 0.65,
      weightTechNoMgmt: 0.35,
      weightGeneralWithMgmt: 0.50,
      weightMgmtWithMgmt: 0.30,
      weightTechWithMgmt: 0.20,
      ...parsed,
      baselineScoreCommon: (typeof parsed.baselineScoreCommon === 'number' && parsed.baselineScoreCommon > 0)
        ? parsed.baselineScoreCommon
        : defaultParameters.baselineScoreCommon,
      baselineScoreTmdvStaff: (typeof parsed.baselineScoreTmdvStaff === 'number' && parsed.baselineScoreTmdvStaff > 0)
        ? parsed.baselineScoreTmdvStaff
        : defaultParameters.baselineScoreTmdvStaff,
      baselineScoreTmdvMgmt: (typeof parsed.baselineScoreTmdvMgmt === 'number' && parsed.baselineScoreTmdvMgmt > 0)
        ? parsed.baselineScoreTmdvMgmt
        : defaultParameters.baselineScoreTmdvMgmt,
      baselineScoreNshcStaff: (typeof parsed.baselineScoreNshcStaff === 'number' && parsed.baselineScoreNshcStaff > 0)
        ? parsed.baselineScoreNshcStaff
        : defaultParameters.baselineScoreNshcStaff,
      baselineScoreNshcMgmt: (typeof parsed.baselineScoreNshcMgmt === 'number' && parsed.baselineScoreNshcMgmt > 0)
        ? parsed.baselineScoreNshcMgmt
        : defaultParameters.baselineScoreNshcMgmt,
      policyVersion: '2026_v4',
      policyRules: (parsed.policyRules && Array.isArray(parsed.policyRules) && parsed.policyVersion === '2026_v4' && parsed.policyRules.length >= 6)
        ? parsed.policyRules
        : initialPolicyRules,
    };
  });

  const baselinePoints = useMemo(() => getCalculatedBaselinePoints(params), [params]);

  // Track which collections have completed initial Cloud load
  const isCloudLoadedRef = React.useRef<Record<string, boolean>>({});

  // FIREBASE REALTIME CLOUD SYNC
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubStaff = subscribeToCollection('staff_list', (cloudData) => {
      isCloudLoadedRef.current['staff_list'] = true;
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        const sanitized = cloudData.map((st: Staff) => {
          const baselines = getStaffBaselineScores(st, params);
          return {
            ...st,
            generalScore: baselines.generalScore,
            techScore: baselines.techScore,
            mgmtScore: baselines.mgmtScore,
            totalScore: baselines.totalScore,
            salaryTier: baselines.salaryTier,
            hasCustomTechScore: false,
            hasCustomMgmtScore: false,
          };
        });
        setStaffList(sanitized);
        localStorage.setItem('ncttx_staff_list', JSON.stringify(sanitized));
      }
    }, initialStaffList);

    const unsubIncidents = subscribeToCollection('incidents', (cloudData) => {
      isCloudLoadedRef.current['incidents'] = true;
      if (Array.isArray(cloudData)) {
        setIncidents(prevIncidents => {
          const map = new Map<string, IncidentRecord>();
          // Put cloud items
          cloudData.forEach((item: IncidentRecord) => {
            if (item && item.id) map.set(item.id, item);
          });
          // Preserve local items created during runtime if not in cloudData yet
          let hasMissingInCloud = false;
          prevIncidents.forEach((item: IncidentRecord) => {
            if (item && item.id && !map.has(item.id)) {
              map.set(item.id, item);
              hasMissingInCloud = true;
            }
          });
          const merged = Array.from(map.values()).sort((a, b) => {
            const dateA = a.createdAt || a.date || a.id || '';
            const dateB = b.createdAt || b.date || b.id || '';
            return dateB.localeCompare(dateA);
          });
          localStorage.setItem('ncttx_incidents', JSON.stringify(merged));
          if (hasMissingInCloud) {
            syncIncidentsToCloudAtomic(merged);
          }
          return merged;
        });
      }
    }, initialIncidents);

    const unsubQuestions = subscribeToCollection('questions', (cloudData) => {
      isCloudLoadedRef.current['questions'] = true;
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        setQuestions(cloudData);
        localStorage.setItem('ncttx_questions', JSON.stringify(cloudData));
      }
    }, initialQuestions);

    const unsubParams = subscribeToCollection('params', (data) => {
      isCloudLoadedRef.current['params'] = true;
      if (data && typeof data === 'object') {
        setParams(prev => {
          const isOldPolicy = !data.policyVersion || data.policyVersion !== '2026_v4' || !data.policyRules || data.policyRules.length < 6;
          const updated = {
            ...prev,
            ...data,
            policyVersion: '2026_v4',
            policyRules: isOldPolicy ? initialPolicyRules : data.policyRules,
          };
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

  // Sync isManager and isAdmin state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const isSysAdmin = isSystemAdmin(currentUser);
      setIsManager(currentUser.isManager || isSysAdmin || isDeptHeadOrAboveRole(currentUser));
      localStorage.setItem('ncttx_current_user', JSON.stringify({
        ...currentUser,
        isAdmin: isSysAdmin,
      }));
    } else {
      setIsManager(false);
      localStorage.removeItem('ncttx_current_user');
    }
  }, [currentUser]);

  // Auto-sync currentUser's admin privileges with staffList (e.g. when promoted to Co-Admin)
  useEffect(() => {
    if (currentUser && currentUser.id !== 'ADMIN') {
      const staffMember = staffList.find(s => s.id.trim().toUpperCase() === currentUser.id.trim().toUpperCase());
      if (staffMember) {
        const shouldBeAdmin = isSystemAdmin(staffMember);
        if (currentUser.isAdmin !== shouldBeAdmin) {
          setCurrentUser(prev => prev ? { ...prev, isAdmin: shouldBeAdmin } : null);
        }
      }
    }
  }, [staffList, currentUser]);

  // Ensure Kế Toán line exists and TTX005 is set to Trưởng phòng Kế toán
  useEffect(() => {
    setLines(prev => {
      if (!prev.some(l => l.name === 'Kế Toán' || l.id === 'KE_TOAN')) {
        const keToanLine: DepartmentLine = {
          id: 'KE_TOAN',
          name: 'Kế Toán',
          status: '✅ đủ nội dung',
          applyTrack: 'chuyên môn + quản lý',
          scopeDescription: 'Quản lý tài chính, hạch toán kế toán, bảng lương và cơ cấu thu nhập tổ chức.',
          criteriaType: '20 nhóm tiêu chí quản lý & kế toán',
          levels: 'CM Nhân viên tới Chuyên gia · QL Trưởng phòng Kế toán',
          hasSalesPoint: false,
          matrixSheetName: '📐 Kế Toán',
          questionCount: 15,
        };
        return [keToanLine, ...prev];
      }
      return prev;
    });

    setStaffList(prev => prev.map(s => {
      let item = { ...s };
      if (item.department === 'Kế toán chức năng & Thuế' || item.department === 'Kế toán chức năng' || item.department === 'KẾ TOÁN CHỨC NĂNG & THUẾ') {
        item.department = 'Kế Toán';
      }
      if (item.id === 'TTX005') {
        item = {
          ...item,
          role: 'Trưởng phòng Kế toán',
          positionCategory: 'Head of Accounting',
          department: 'Kế Toán',
          line: 'Kế Toán',
          jobLevel: 'Trưởng phòng',
          isManager: true,
        };
      }
      return item;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('ncttx_user_passwords', JSON.stringify(userPasswords));
  }, [userPasswords]);

  // Reference for BroadcastChannel cross-tab realtime synchronization
  const syncChannelRef = React.useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel & Storage Event Listener for Cross-Tab / Cross-Account Realtime Sync
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('ncttx_realtime_sync_channel');
      syncChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (!payload) return;

        if (type === 'INCIDENTS_UPDATED' && Array.isArray(payload)) {
          setIncidents(payload);
        } else if (type === 'STAFF_UPDATED' && Array.isArray(payload)) {
          setStaffList(payload);
        } else if (type === 'QUESTIONS_UPDATED' && Array.isArray(payload)) {
          setQuestions(payload);
        } else if (type === 'LINES_UPDATED' && Array.isArray(payload)) {
          setLines(payload);
        } else if (type === 'PARAMS_UPDATED') {
          setParams(payload);
        }
      };
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'ncttx_incidents') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setIncidents(parsed);
        } else if (e.key === 'ncttx_staff_list') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setStaffList(parsed);
        } else if (e.key === 'ncttx_questions') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setQuestions(parsed);
        } else if (e.key === 'ncttx_lines') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setLines(parsed);
        } else if (e.key === 'ncttx_params') {
          const parsed = JSON.parse(e.newValue);
          if (parsed) setParams(parsed);
        }
      } catch (err) { }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (syncChannelRef.current) {
        syncChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper: Persist and broadcast realtime data sync across all tabs/users & Cloud
  const notifySync = (key: string, payload: any) => {
    const storageKey = `ncttx_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(payload));

    if (syncChannelRef.current) {
      const typeMap: Record<string, string> = {
        incidents: 'INCIDENTS_UPDATED',
        staff_list: 'STAFF_UPDATED',
        questions: 'QUESTIONS_UPDATED',
        lines: 'LINES_UPDATED',
        params: 'PARAMS_UPDATED',
      };
      if (typeMap[key]) {
        syncChannelRef.current.postMessage({
          type: typeMap[key],
          payload,
        });
      }
    }

    if (key === 'incidents' && Array.isArray(payload)) {
      syncIncidentsToCloudAtomic(payload);
    } else {
      saveToCloud(key, payload);
    }
  };

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
      if (syncChannelRef.current) {
        syncChannelRef.current.postMessage({
          type: 'PASSWORDS_UPDATED',
          payload: updated,
        });
      }
      return updated;
    });
  };

  // Handler: Reset all staff passwords to default '123456' and force first-login change
  const handleResetAllPasswords = () => {
    setUserPasswords(prev => {
      const updated: Record<string, string> = {};
      staffList.forEach(s => {
        if (s && s.id) {
          updated[s.id.trim().toUpperCase()] = '123456';
        }
      });
      // Keep Admin password intact if already customized, or default to '123456A!'
      updated['ADMIN'] = prev['ADMIN'] || '123456A!';

      localStorage.setItem('ncttx_user_passwords', JSON.stringify(updated));
      saveToCloud('user_passwords', updated);
      if (syncChannelRef.current) {
        syncChannelRef.current.postMessage({
          type: 'PASSWORDS_UPDATED',
          payload: updated,
        });
      }
      return updated;
    });
  };

  // Handler: Manual Refresh All Cloud Data directly from Firestore
  const handleRefreshCloudData = async () => {
    setIsRefreshingCloud(true);
    try {
      const [staffData, incidentData, questionData, paramData, passwordData] = await Promise.all([
        fetchDocFromCloud('staff_list'),
        fetchDocFromCloud('incidents'),
        fetchDocFromCloud('questions'),
        fetchDocFromCloud('params'),
        fetchDocFromCloud('user_passwords'),
      ]);

      if (Array.isArray(staffData) && staffData.length > 0) {
        const sanitized = staffData.map((st: Staff) => {
          const baselines = getStaffBaselineScores(st, params);
          return {
            ...st,
            generalScore: baselines.generalScore,
            techScore: baselines.techScore,
            mgmtScore: baselines.mgmtScore,
            totalScore: baselines.totalScore,
            salaryTier: baselines.salaryTier,
            hasCustomTechScore: false,
            hasCustomMgmtScore: false,
          };
        });
        setStaffList(sanitized);
        localStorage.setItem('ncttx_staff_list', JSON.stringify(sanitized));
      }

      setIncidents(prevIncidents => {
        const map = new Map<string, IncidentRecord>();
        if (Array.isArray(incidentData)) {
          incidentData.forEach((item: IncidentRecord) => {
            if (item && item.id) map.set(item.id, item);
          });
        }
        let hasMissingInCloud = false;
        prevIncidents.forEach((item: IncidentRecord) => {
          if (item && item.id && !map.has(item.id)) {
            map.set(item.id, item);
            hasMissingInCloud = true;
          }
        });
        const sorted = Array.from(map.values()).sort((a, b) => {
          const dateA = a.createdAt || a.date || a.id || '';
          const dateB = b.createdAt || b.date || b.id || '';
          return dateB.localeCompare(dateA);
        });
        localStorage.setItem('ncttx_incidents', JSON.stringify(sorted));
        if (hasMissingInCloud) {
          syncIncidentsToCloudAtomic(sorted);
        }
        return sorted;
      });

      if (Array.isArray(questionData) && questionData.length > 0) {
        setQuestions(questionData);
        localStorage.setItem('ncttx_questions', JSON.stringify(questionData));
      }

      if (paramData && typeof paramData === 'object') {
        setParams(prev => ({ ...prev, ...paramData }));
        localStorage.setItem('ncttx_params', JSON.stringify(paramData));
      }

      if (passwordData && typeof passwordData === 'object') {
        setUserPasswords(prev => ({ ...prev, ...passwordData }));
        localStorage.setItem('ncttx_user_passwords', JSON.stringify(passwordData));
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Cloud:', err);
    } finally {
      setIsRefreshingCloud(false);
    }
  };

  // Handler: Add new incident record (accessible to any account)
  const handleAddIncident = (newIncident: IncidentRecord) => {
    setIncidents(prev => {
      const updated = [newIncident, ...prev];
      notifySync('incidents', updated);
      return updated;
    });

    if (newIncident.status === 'Đã duyệt' || newIncident.status === 'Đã ghi nhận' || newIncident.type === 'vi_pham') {
      applyIncidentScoreImpact(newIncident);
    }
  };

  // Handler: Admin & Co-Admin soft-deletes an incident record (moves to Trash Bin)
  const handleDeleteIncident = (incidentId: string) => {
    if (!isSystemAdmin(currentUser)) {
      alert("⚠️ Thao tác bị từ chối: Chỉ quản trị viên (Admin / Co-Admin) mới có quyền xóa phiếu ghi nhận / biên bản!");
      return;
    }
    setIncidents(prev => {
      const targetInc = prev.find(i => i.id === incidentId);
      if (targetInc && !targetInc.isDeleted && (targetInc.status === 'Đã duyệt' || targetInc.type === 'vi_pham')) {
        refundIncidentScoreImpact(targetInc);
      }
      const updated = prev.map(i => {
        if (i.id === incidentId) {
          return {
            ...i,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            deletedBy: currentUser?.name || 'Admin',
          };
        }
        return i;
      });
      notifySync('incidents', updated);
      return updated;
    });
  };

  // Handler: Admin & Co-Admin restores an incident record from Trash Bin
  const handleRestoreIncident = (incidentId: string) => {
    if (!isSystemAdmin(currentUser)) {
      alert("⚠️ Thao tác bị từ chối: Chỉ quản trị viên (Admin / Co-Admin) mới có quyền khôi phục phiếu!");
      return;
    }
    setIncidents(prev => {
      const targetInc = prev.find(i => i.id === incidentId);
      if (targetInc && targetInc.isDeleted && (targetInc.status === 'Đã duyệt' || targetInc.type === 'vi_pham')) {
        applyIncidentScoreImpact(targetInc);
      }
      const updated = prev.map(i => {
        if (i.id === incidentId) {
          const copy = { ...i };
          delete copy.isDeleted;
          delete copy.deletedAt;
          delete copy.deletedBy;
          return copy;
        }
        return i;
      });
      notifySync('incidents', updated);
      return updated;
    });
  };

  // Handler: Admin & Co-Admin permanently purges an incident record from Trash Bin
  const handlePermanentDeleteIncident = (incidentId: string) => {
    if (!isSystemAdmin(currentUser)) {
      alert("⚠️ Thao tác bị từ chối: Chỉ quản trị viên (Admin / Co-Admin) mới có quyền xóa vĩnh viễn phiếu!");
      return;
    }
    setIncidents(prev => {
      const targetInc = prev.find(i => i.id === incidentId);
      if (targetInc && !targetInc.isDeleted && !targetInc.isPurged && (targetInc.status === 'Đã duyệt' || targetInc.type === 'vi_pham')) {
        refundIncidentScoreImpact(targetInc);
      }
      const updated = prev.map(i => {
        if (i.id === incidentId) {
          return {
            ...i,
            isDeleted: true,
            isPurged: true,
            deletedAt: new Date().toISOString(),
          };
        }
        return i;
      });
      notifySync('incidents', updated);
      return updated;
    });
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
      notifySync('incidents', updated);
      return updated;
    });
  };

  // Handler: HR Head / Admin resolves 48h appeal
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
      notifySync('incidents', updated);
      return updated;
    });
  };

  // Helper: Safe number parser
  const safeNum = (val: any, fallback = 5.0): number => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Helper: Refund points upon approved appeal
  // Helper: Refund score impact when ticket is rejected/deleted
  const refundIncidentScoreImpact = (incident: IncidentRecord) => {
    if (!incident || typeof incident.impactPoints !== 'number' || incident.impactPoints === 0) return;
    const impact = safeNum(incident.impactPoints, 0);
    const pillar = getIncidentTargetPillar(incident);

    setStaffList(prev => {
      const updated = prev.map(staff => {
        if (staff.id === incident.targetId) {
          const baselines = getStaffBaselineScores(staff, params);
          const isMgmt = isManagementRole(staff);
          let curGen = safeNum(staff.generalScore, baselines.generalScore);
          let curTech = safeNum(staff.techScore, baselines.techScore);
          let curMgmt = isMgmt ? safeNum(staff.mgmtScore, baselines.mgmtScore ?? 0) : undefined;

          // Reversing impact: subtract impactPoints!
          if (pillar === 'mgmt' && isMgmt && curMgmt !== undefined) {
            curMgmt = Math.max(0, Math.min(5, Number((curMgmt - impact).toFixed(2))));
          } else if (pillar === 'tech') {
            curTech = Math.max(0, Math.min(5, Number((curTech - impact).toFixed(2))));
          } else {
            curGen = Math.max(0, Math.min(5, Number((curGen - impact).toFixed(2))));
          }

          const newTotalScore = calculateTotalScore(curGen, curTech, curMgmt, params, isMgmt);
          const salaryTier = calculateSalaryTier(newTotalScore, params);

          return {
            ...staff,
            generalScore: curGen,
            techScore: curTech,
            mgmtScore: curMgmt,
            totalScore: newTotalScore,
            salaryTier,
          };
        }
        return staff;
      });
      notifySync('staff_list', updated);
      return updated;
    });
  };

  // Handler: HR / Manager updates incident approval status
  const handleUpdateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => {
      const targetInc = prev.find(i => i.id === id);
      const updatedList = prev.map(inc => {
        if (inc.id === id) {
          const updated = { ...inc, status };
          if (status === 'Đã duyệt' || status === 'Đã ghi nhận') {
            applyIncidentScoreImpact(updated);
          } else if (status === 'Từ chối' && (targetInc?.status === 'Đã duyệt' || targetInc?.status === 'Đã ghi nhận')) {
            refundIncidentScoreImpact(targetInc);
          }
          return updated;
        }
        return inc;
      });
      notifySync('incidents', updatedList);
      return updatedList;
    });
  };

  // Helper: Apply score impact to target staff
  const applyIncidentScoreImpact = (incident: IncidentRecord) => {
    if (!incident || typeof incident.impactPoints !== 'number' || incident.impactPoints === 0) return;
    const impact = safeNum(incident.impactPoints, 0);
    const pillar = getIncidentTargetPillar(incident);

    setStaffList(prev => {
      const updated = prev.map(staff => {
        if (staff.id === incident.targetId) {
          const baselines = getStaffBaselineScores(staff, params);
          const isMgmt = isManagementRole(staff);
          let curGen = safeNum(staff.generalScore, baselines.generalScore);
          let curTech = safeNum(staff.techScore, baselines.techScore);
          let curMgmt = isMgmt ? safeNum(staff.mgmtScore, baselines.mgmtScore ?? 0) : undefined;

          if (pillar === 'mgmt' && isMgmt && curMgmt !== undefined) {
            curMgmt = Math.max(0, Math.min(5, Number((curMgmt + impact).toFixed(2))));
          } else if (pillar === 'tech') {
            curTech = Math.max(0, Math.min(5, Number((curTech + impact).toFixed(2))));
          } else {
            curGen = Math.max(0, Math.min(5, Number((curGen + impact).toFixed(2))));
          }

          const newTotalScore = calculateTotalScore(curGen, curTech, curMgmt, params, isMgmt);
          const salaryTier = calculateSalaryTier(newTotalScore, params);

          return {
            ...staff,
            generalScore: curGen,
            techScore: curTech,
            mgmtScore: curMgmt,
            totalScore: newTotalScore,
            salaryTier,
          };
        }
        return staff;
      });
      notifySync('staff_list', updated);
      return updated;
    });
  };

  // Handler: Add new staff member
  const handleAddStaff = (newStaff: Staff) => {
    setStaffList(prev => {
      const updated = [newStaff, ...prev];
      notifySync('staff_list', updated);
      return updated;
    });
  };

  // Handler: Update existing staff member / toggle co-admin role
  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaffList(prev => {
      const updated = prev.map(s => s.id === updatedStaff.id ? updatedStaff : s);
      localStorage.setItem('ncttx_staff_list', JSON.stringify(updated));
      saveToCloud('staff_list', updated);
      return updated;
    });

    // If updating the currently logged-in user, immediately update currentUser session state
    if (currentUser && currentUser.id === updatedStaff.id) {
      const isSysAdmin = isSystemAdmin(updatedStaff);
      setCurrentUser(prev => prev ? {
        ...prev,
        name: updatedStaff.name,
        role: updatedStaff.role,
        department: updatedStaff.department,
        jobLevel: updatedStaff.jobLevel,
        isManager: !!updatedStaff.isManager || isSysAdmin || ['Trưởng phòng', 'Founder', 'C-Level', 'Manager'].includes(updatedStaff.jobLevel),
        isAdmin: isSysAdmin,
      } : null);
    }
  };

  // Handler: Delete staff member (protect master ADMIN from deletion)
  const handleDeleteStaff = (staffId: string) => {
    if (staffId.trim().toUpperCase() === 'ADMIN') {
      alert("⚠️ Không thể xóa tài khoản Quản Trị Viên gốc (ADMIN)!");
      return;
    }
    setStaffList(prev => {
      const updated = prev.filter(s => s.id !== staffId);
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

  // Handler: Update existing question
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(prev => {
      const updated = prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
      localStorage.setItem('ncttx_questions', JSON.stringify(updated));
      saveToCloud('questions', updated);
      return updated;
    });
  };

  // Handler: Update system parameters (baseline points & weights)
  const handleUpdateParams = (newParams: ParameterConfig) => {
    setParams(newParams);
    localStorage.setItem('ncttx_params', JSON.stringify(newParams));
    saveToCloud('params', newParams);

    // Immediately recalculate all staff baselines and totals with newParams
    setStaffList(prev => {
      const updated = prev.map(st => {
        const baselines = getStaffBaselineScores(st, newParams);
        const approvedIncidents = incidents.filter(
          i => i.targetId === st.id &&
            !i.isDeleted &&
            (i.status === 'Đã duyệt' || i.status === 'Đã ghi nhận')
        );
        let curGen = baselines.generalScore;
        let curTech = baselines.techScore;
        const isMgmt = isManagementRole(st);
        let curMgmt = isMgmt ? (baselines.mgmtScore ?? 0) : undefined;

        approvedIncidents.forEach(inc => {
          if (typeof inc.impactPoints === 'number' && !isNaN(inc.impactPoints) && inc.impactPoints !== 0) {
            const pillar = getIncidentTargetPillar(inc);
            if (pillar === 'mgmt' && isMgmt && curMgmt !== undefined) {
              curMgmt += inc.impactPoints;
            } else if (pillar === 'tech') {
              curTech += inc.impactPoints;
            } else {
              curGen += inc.impactPoints;
            }
          }
        });

        curGen = Math.max(0, Math.min(5, Number(curGen.toFixed(2))));
        curTech = Math.max(0, Math.min(5, Number(curTech.toFixed(2))));
        if (curMgmt !== undefined) {
          curMgmt = Math.max(0, Math.min(5, Number(curMgmt.toFixed(2))));
        }

        const totalScore = calculateTotalScore(curGen, curTech, curMgmt, newParams, isMgmt);
        const salaryTier = calculateSalaryTier(totalScore, newParams);

        return {
          ...st,
          generalScore: curGen,
          techScore: curTech,
          mgmtScore: curMgmt,
          totalScore,
          salaryTier,
          hasCustomTechScore: false,
          hasCustomMgmtScore: false,
        };
      });
      localStorage.setItem('ncttx_staff_list', JSON.stringify(updated));
      saveToCloud('staff_list', updated);
      return updated;
    });
  };

  // IF NOT LOGGED IN: DISPLAY ONLY THE STANDALONE LOGIN GATE!
  if (!currentUser) {
    return (
      <LoginModal
        isOpen={true}
        isStandalone={true}
        onClose={() => { }}
        staffList={staffList}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        userPasswords={userPasswords}
        onUpdatePassword={handleUpdatePassword}
      />
    );
  }

  // OFFICIALLY APPLY OPTION 1 AS THE PRIMARY MAIN INTERFACE!
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
        baselinePoints={baselinePoints}
        onUpdateParams={handleUpdateParams}
        currentUser={currentUser}
        isManager={isManager}
        userPasswords={userPasswords}
        onOpenIncidentModal={handleOpenIncidentModal}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onLogout={() => setCurrentUser(null)}
        onAddStaff={handleAddStaff}
        onUpdateStaff={handleUpdateStaff}
        onDeleteStaff={handleDeleteStaff}
        onUpdatePassword={handleUpdatePassword}
        onResetAllPasswords={handleResetAllPasswords}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onAddIncident={handleAddIncident}
        onDeleteIncident={handleDeleteIncident}
        onRestoreIncident={handleRestoreIncident}
        onPermanentDeleteIncident={handlePermanentDeleteIncident}
        onUpdateStatus={handleUpdateIncidentStatus}
        onAppealIncident={handleAppealIncident}
        onResolveAppeal={handleResolveAppeal}
        onRefreshCloud={handleRefreshCloudData}
        isRefreshingCloud={isRefreshingCloud}
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

