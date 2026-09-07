import React, { useState } from 'react';
import { AuthUser, Staff } from '../types';
import { 
  Lock, 
  User, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#0F281E] selection:bg-emerald-500 selection:text-white">
      
      {/* Decorative Background Lighting Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/60 overflow-hidden transform transition-all my-auto">
        
        {/* Close Button (if non-standalone modal) */}
        {!isStandalone && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all"
            title="Đóng"
          >
            ✕
          </button>
        )}

        {/* Top Brand Banner */}
        <div className="bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white pt-8 pb-7 px-6 text-center relative border-b border-emerald-600/30">
          
          {/* Logo Badge Container */}
          <div className="relative inline-block mb-3">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-3xl blur-md opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/logo.png" 
              alt="Nhà Của Thời Thanh Xuân Logo" 
              className="relative w-28 h-28 object-contain rounded-2xl bg-white p-2.5 shadow-xl mx-auto border border-emerald-100 transform hover:scale-105 transition-all duration-300" 
            />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
            THỜI THANH XUÂN
          </h2>
          
          <p className="text-xs text-emerald-100 font-semibold mt-1 tracking-wide uppercase">
            Hệ Thống Ghi Nhận Phản Hồi Nhân Sự
          </p>

          <div className="inline-block mt-2.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[11px] text-emerald-200 font-medium">
            StaffPoint v3.0
          </div>
        </div>

        {/* Modal Body Form */}
        <div className="p-6 sm:p-7 space-y-5">

          {/* SUCCESS ALERT */}
          {changeSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2.5 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{changeSuccessMsg}</span>
            </div>
          )}

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-start space-x-2.5 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* CASE 1: Forced Password Change Step */}
          {isChangingPasswordStep ? (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium shadow-sm">
                🔒 Tài khoản <strong>[{pendingUser?.id}] {pendingUser?.name}</strong> đang dùng mật khẩu mặc định. Vui lòng tạo mật khẩu mới để bảo mật dữ liệu!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu mới</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Xác nhận lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Cập Nhật Mật Khẩu & Đăng Nhập</span>
                </button>
              </div>
            </form>
          ) : currentUser && !isStandalone ? (
            /* CASE 2: Already Logged In Profile Card */
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-left space-y-2.5 shadow-sm">
                <div className="flex items-center space-x-2 text-[#1B4332]">
                  <ShieldCheck className="w-5 h-5 text-[#2D6A4F]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Tài khoản đang hoạt động</span>
                </div>

                <div className="pt-1">
                  <div className="text-lg font-black text-[#1B4332]">{currentUser.name}</div>
                  <div className="text-xs text-slate-600 font-bold mt-0.5">Mã NV: <span className="font-mono text-emerald-800">{currentUser.id}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">{currentUser.department}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => {
                    setIsChangingPasswordStep(true);
                    setPendingUser(currentUser);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-amber-50 text-[#DD6B20] border border-amber-200 text-xs font-extrabold hover:bg-amber-100 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-3 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold hover:bg-rose-100 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE 3: Clean Single Login Form */
            <form onSubmit={handleSubmitLogin} className="space-y-4">
              
              {/* User ID Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Mã Số Nhân Viên / Mã Admin
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="VD: TTX005, TTX030, ADMIN..."
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent font-mono uppercase tracking-wide transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu truy cập"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all shadow-inner"
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
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2D6A4F] via-[#1B4332] to-[#2D6A4F] hover:from-[#1B4332] hover:to-[#1B4332] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/25 flex items-center justify-center space-x-2 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <span>Đăng Nhập Hệ Thống</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400 font-medium italic">
                  Liên hệ Admin hệ thống nếu quên mã nhân viên hoặc mật khẩu.
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

