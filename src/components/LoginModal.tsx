import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import { AuthUser, Staff } from '../types';
import { 
  User, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Building, 
  Briefcase 
} from 'lucide-react';

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
}) => {
  const [idInput, setIdInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Password Change Step State
  const [isChangingPasswordStep, setIsChangingPasswordStep] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
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
      setErrorMsg('Mật khẩu mới không được dùng lại mật khẩu mặc định (123456)!');
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
      setChangeSuccessMsg('Đổi mật khẩu thành công! Đang tự động đăng nhập...');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#FAF9F5] selection:bg-[#1B4332] selection:text-white">
      
      {/* Background Soft Organic Radial Light */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/5 via-transparent to-[#1B4332]/10 pointer-events-none" />

      {/* Main Login Card - Simple, Clean & Modern */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl border border-emerald-900/10 p-6 sm:p-8 overflow-hidden transform transition-all my-auto">
        
        {/* Close Button (if non-standalone modal) */}
        {!isStandalone && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            title="Đóng"
          >
            ✕
          </button>
        )}

        {/* Clean Logo Banner Header */}
        <div className="text-center mb-6">
          <img 
            src={logoImg} 
            alt="Nhà Của Thời Thanh Xuân Logo" 
            className="w-32 sm:w-36 h-auto object-contain mx-auto mb-3" 
          />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#1B4332] tracking-tight">
            Ghi Nhận Phản Hồi Nhân Sự
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Nhà Của Thời Thanh Xuân
          </p>
        </div>

        {/* SUCCESS ALERT */}
        {changeSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{changeSuccessMsg}</span>
          </div>
        )}

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* CASE 1: Forced Password Change Step */}
        {isChangingPasswordStep ? (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium">
              🔒 Vui lòng cập nhật mật khẩu mới cho tài khoản <strong>[{pendingUser?.id}] {pendingUser?.name}</strong>.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <span>Cập Nhật & Đăng Nhập</span>
              </button>
            </div>
          </form>
        ) : currentUser && !isStandalone ? (
          /* CASE 2: Already Logged In Profile Card */
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-left space-y-2">
              <div className="flex items-center space-x-1.5 text-[#1B4332]">
                <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
                <span className="text-xs font-bold uppercase tracking-wider">Đã đăng nhập</span>
              </div>
              <div className="text-base font-extrabold text-[#1B4332] pt-1">{currentUser.name}</div>
              <div className="text-xs text-slate-600 font-semibold">Mã NV: <span className="font-mono text-emerald-800">{currentUser.id}</span></div>
              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium pt-1 border-t border-emerald-200/60">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser.department}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => {
                  setIsChangingPasswordStep(true);
                  setPendingUser(currentUser);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center space-x-1 transition-all"
              >
                <span>Đổi mật khẩu</span>
              </button>
              <button
                onClick={onLogout}
                className="flex-1 py-2.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center justify-center space-x-1 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* CASE 3: Clean & Simple Direct Login Form */
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            
            {/* User ID Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã số nhân viên / Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: TTX005, ADMIN..."
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-mono uppercase transition-all"
                />
              </div>
            </div>

            {/* Password Input with Eye Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-extrabold text-xs tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};


