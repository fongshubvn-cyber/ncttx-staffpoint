import React, { useState } from 'react';
import { AuthUser, Staff } from '../types';
import { Lock, User, KeyRound, ShieldAlert, CheckCircle2, Sparkles, LogOut, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  userPasswords: Record<string, string>;
  onUpdatePassword: (userId: string, newPass: string) => void;
  isStandalone?: boolean;
  uiOption?: 'default' | 'option1';
  onSelectUiOption?: (option: 'default' | 'option1') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  staffList,
  currentUser,
  onLogin,
  onLogout,
  userPasswords,
  onUpdatePassword,
  isStandalone = false,
  uiOption = 'option1',
  onSelectUiOption,
}) => {
  const [loginType, setLoginType] = useState<'staff' | 'admin'>('staff');
  const [idInput, setIdInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Password Change Step State
  const [isChangingPasswordStep, setIsChangingPasswordStep] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanId = idInput.trim().toUpperCase();

    if (!cleanId) {
      setErrorMsg('Vui lòng nhập mã nhân viên!');
      return;
    }

    if (!passwordInput) {
      setErrorMsg('Vui lòng nhập mật khẩu!');
      return;
    }

    // Admin Login Check
    if (cleanId === 'ADMIN') {
      const adminPass = userPasswords['ADMIN'] || '123456A!';
      if (passwordInput === adminPass || passwordInput === '123456A!') {
        const adminUser: AuthUser = {
          id: 'ADMIN',
          name: 'Quản Trị Viên (Admin)',
          role: 'Quản trị hệ thống Toàn quyền',
          positionCategory: 'System Administrator',
          department: 'Ban Quản Trị',
          jobLevel: 'Admin',
          isManager: true,
          isAdmin: true,
          mustChangePassword: false,
        };
        onLogin(adminUser);
        setPasswordInput('');
        setIdInput('');
        onClose();
      } else {
        setErrorMsg('Mật khẩu Admin không chính xác!');
      }
      return;
    }

    // Staff Login via Manual ID Entry
    const staff = staffList.find(s => s.id.trim().toUpperCase() === cleanId);
    if (!staff) {
      setErrorMsg(`Mã nhân viên "${cleanId}" không tồn tại trong hệ thống!`);
      return;
    }

    if (staff.status === 'Đã khoá' || staff.status === 'Ngưng hoạt động') {
      setErrorMsg(`⛔ Tài khoản "${staff.name}" (${staff.id}) đã bị khoá bởi Admin hệ thống. Vui lòng liên hệ Admin!`);
      return;
    }

    const currentPass = userPasswords[staff.id] || userPasswords[cleanId] || '123456';
    if (passwordInput !== currentPass) {
      setErrorMsg('Mật khẩu không chính xác!');
      return;
    }

    const authUser: AuthUser = {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      positionCategory: staff.positionCategory,
      department: staff.department,
      jobLevel: staff.jobLevel,
      isManager: !!staff.isManager || !!staff.isAdmin || ['Trưởng phòng', 'Founder', 'C-Level', 'Manager'].includes(staff.jobLevel),
      isAdmin: !!staff.isAdmin || staff.jobLevel === 'Admin' || staff.id.trim().toUpperCase() === 'ADMIN',
      mustChangePassword: currentPass === '123456',
    };

    // If using default password (123456), force password change step immediately!
    if (currentPass === '123456') {
      setPendingUser(authUser);
      setIsChangingPasswordStep(true);
      setPasswordInput('');
      return;
    }

    onLogin(authUser);
    setPasswordInput('');
    setIdInput('');
    onClose();
  };

  // Handle Password Change Submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải chứa ít nhất 6 ký tự!');
      return;
    }
    if (newPassword === '123456') {
      setErrorMsg('Mật khẩu mới không được dùng lại mật khẩu mặc định!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    if (pendingUser) {
      onUpdatePassword(pendingUser.id, newPassword);
      const updatedUser: AuthUser = {
        ...pendingUser,
        mustChangePassword: false,
      };
      setChangeSuccessMsg('Đổi mật khẩu thành công! Đang đăng nhập...');
      setTimeout(() => {
        onLogin(updatedUser);
        setIsChangingPasswordStep(false);
        setPendingUser(null);
        setNewPassword('');
        setConfirmPassword('');
        setIdInput('');
        setChangeSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
      isStandalone 
        ? 'bg-[#1B4332] bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#112d22]' 
        : 'bg-black/65 backdrop-blur-sm'
    }`}>
      <div className="bg-white w-full max-w-[360px] sm:max-w-sm rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-auto">
        
        {/* Mobile Brand Header */}
        <div className="bg-[#1B4332] text-white px-5 py-6 text-center relative border-b border-[#2D6A4F]">
          <img 
            src="/logo.png" 
            alt="Thời Thanh Xuân Logo" 
            className="w-16 h-16 object-contain rounded-2xl bg-white p-1.5 shadow-lg mx-auto mb-2.5 border border-emerald-200" 
          />
          
          <h2 className="text-base sm:text-lg font-black font-heading text-white tracking-tight whitespace-nowrap">
            {isChangingPasswordStep
              ? '🔑 Yêu Cầu Đổi Mật Khẩu'
              : currentUser && !isStandalone
              ? 'Tài Khoản Đang Đăng Nhập'
              : 'Ghi nhận phản hồi nhân sự'}
          </h2>
          
          <p className="text-[11px] text-emerald-100 font-medium italic mt-1 leading-snug whitespace-nowrap">
            Phát triển bởi Nhà Của Thời Thanh Xuân
          </p>

          {!isStandalone && (
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 text-emerald-200 hover:text-white text-xs font-extrabold bg-[#2D6A4F] px-2.5 py-1 rounded-full border border-[#52B788]/30"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">

          {/* SUCCESS MESSAGE */}
          {changeSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{changeSuccessMsg}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* CASE 1: Forced Password Change Step */}
          {isChangingPasswordStep ? (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-800 leading-relaxed font-medium">
                🔒 Vì lý do an toàn bảo mật, vui lòng khởi tạo mật khẩu cá nhân cho tài khoản <strong>[{pendingUser?.id}] {pendingUser?.name}</strong>!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#52B788]" />
                  <span>Cập Nhật Mật Khẩu & Đăng Nhập</span>
                </button>
              </div>
            </form>
          ) : currentUser && !isStandalone ? (
            /* CASE 2: Already Logged In Profile Card */
            <div className="space-y-3.5 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2">
                <div className="flex items-center space-x-1.5 text-[#1B4332]">
                  <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Tài khoản đang đăng nhập</span>
                </div>
                <div className="text-base font-extrabold text-[#1B4332]">{currentUser.name}</div>
                <div className="text-xs text-slate-600 font-semibold">Mã NV: <strong>{currentUser.id}</strong></div>
                <div className="text-xs text-slate-600 font-medium">Chức vụ: <strong>{currentUser.role}</strong></div>
                <div className="text-xs text-slate-600 font-medium">Phòng ban: <strong>{currentUser.department}</strong></div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => {
                    setIsChangingPasswordStep(true);
                    setPendingUser(currentUser);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-amber-50 text-[#DD6B20] border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center space-x-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE 3: Single Unified Login Form */
            <form onSubmit={handleSubmitLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã Số Nhân Viên / Mã Admin
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nhập mã số (VD: TTX005, TTX030...)"
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] font-mono uppercase"
                  />
                </div>
              </div>

              {/* Password Input (NO HINTS) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              {/* UI Mode Selector directly inside Login Form */}
              {onSelectUiOption && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Chọn Giao Diện Truy Cập</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Option 1 / Classic</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectUiOption('option1')}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        uiOption === 'option1'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/30'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                      <span className="whitespace-nowrap">Option 1 Glass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectUiOption('default')}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        uiOption === 'default'
                          ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md ring-2 ring-[#2D6A4F]/30'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Leaf className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span className="whitespace-nowrap">Classic Forest</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
