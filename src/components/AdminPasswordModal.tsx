import React, { useState } from 'react';
import { Staff, AuthUser } from '../types';
import { Key, Search, X, Check, ShieldCheck, Lock, RefreshCw, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  userPasswords: Record<string, string>;
  onUpdatePassword: (userId: string, newPass: string) => void;
  onResetAllPasswords?: () => void;
  currentUser: AuthUser | null;
  initialSelectedStaffId?: string;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  staffList,
  userPasswords,
  onUpdatePassword,
  onResetAllPasswords,
  currentUser,
  initialSelectedStaffId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>({});
  const [showPasswordFlags, setShowPasswordFlags] = useState<Record<string, boolean>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen || !currentUser?.isAdmin) return null;

  // Include Admin account + all staff members
  const allAccounts = [
    {
      id: 'ADMIN',
      name: 'Quản Trị Viên (Admin)',
      role: 'Quản trị hệ thống Toàn quyền',
      department: 'Ban Quản Trị',
      isManager: true,
      isAdmin: true,
    },
    ...staffList.map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      department: s.department || s.line || 'Chưa phân chia',
      isManager: !!s.isManager,
      isAdmin: !!s.isAdmin,
    })),
  ];

  const filteredAccounts = allAccounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEffectivePassword = (accId: string) => {
    const cleanId = accId.trim().toUpperCase();
    if (cleanId === 'ADMIN') {
      return userPasswords['ADMIN'] || '123456A!';
    }
    return userPasswords[accId] || userPasswords[cleanId] || '123456';
  };

  const handleSavePassword = (accId: string, accName: string) => {
    const newPass = (passwordInputs[accId] || '').trim();
    if (!newPass) {
      alert('Vui lòng nhập mật khẩu mới trước khi lưu!');
      return;
    }

    onUpdatePassword(accId, newPass);
    setSuccessToast(`✅ Đã đổi mật khẩu thành công cho ${accName} (${accId}) thành "${newPass}"!`);
    setPasswordInputs(prev => ({ ...prev, [accId]: '' }));

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleResetToDefault = (accId: string, accName: string) => {
    const defaultPass = accId === 'ADMIN' ? '123456A!' : '123456';
    if (window.confirm(`🔑 Admin xác nhận: Đặt mật khẩu của [${accId}] ${accName} về mặc định ("${defaultPass}")?`)) {
      onUpdatePassword(accId, defaultPass);
      setPasswordInputs(prev => ({ ...prev, [accId]: defaultPass }));
      setSuccessToast(`✅ Đã đặt mật khẩu mặc định "${defaultPass}" cho ${accName} (${accId})!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleResetAllToDefault = () => {
    if (
      window.confirm(
        `⚠️ CẢNH BÁO QUAN TRỌNG DÀNH CHO ADMIN:\n\nBạn có chắc chắn muốn RESET MẬT KHẨU CỦA TẤT CẢ THÀNH VIÊN về "123456"?\n\n📌 Sau khi thực hiện, tất cả thành viên sẽ BẮT BUỘC ĐỔI MẬT KHẨU MỚI ở lần đăng nhập tiếp theo!`
      )
    ) {
      if (onResetAllPasswords) {
        onResetAllPasswords();
      } else {
        staffList.forEach(s => {
          onUpdatePassword(s.id, '123456');
        });
      }
      setSuccessToast(`✅ Đã reset toàn bộ mật khẩu thành viên về "123456"! Đã kích hoạt yêu cầu đổi mật khẩu lần đầu khi đăng nhập.`);
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Quản Lý Mật Khẩu Tất Cả Thành Viên</h3>
              <p className="text-xs text-slate-500">Quyền Admin: Đổi & đặt lại mật khẩu đăng nhập cho bất kỳ tài khoản nào</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast Banner */}
        {successToast && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shrink-0 animate-in fade-in">
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bulk Reset All Passwords Banner */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Reset Mật Khẩu Hàng Loạt</h4>
              <p className="text-[11px] text-slate-600">Đặt tất cả mật khẩu thành viên về "123456" & yêu cầu đổi MK lần đầu</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAllToDefault}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tất Cả Về 123456</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã NV (TTX...), Tên nhân sự hoặc Phòng ban..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Accounts Password List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1 scrollbar-thin">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">
              Không tìm thấy thành viên phù hợp
            </div>
          ) : (
            filteredAccounts.map((acc) => {
              const currentEffectivePass = getEffectivePassword(acc.id);
              const inputVal = passwordInputs[acc.id] !== undefined ? passwordInputs[acc.id] : '';
              const showPass = !!showPasswordFlags[acc.id];
              const isHighlight = initialSelectedStaffId && acc.id.toUpperCase() === initialSelectedStaffId.toUpperCase();

              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isHighlight
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Account Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl font-black flex items-center justify-center text-sm shrink-0 shadow-sm ${
                        acc.id === 'ADMIN'
                          ? 'bg-amber-500 text-white'
                          : acc.isAdmin
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {acc.name.substring(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {acc.id}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900 truncate">{acc.name}</span>
                          {acc.isAdmin && (
                            <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-amber-700" /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {acc.department} • <span className="font-semibold">{acc.role}</span>
                        </p>
                      </div>
                    </div>

                    {/* Current Effective Password Badge */}
                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      <span className="text-slate-400 text-[11px]">Mật khẩu hiện tại:</span>
                      <code className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                        {currentEffectivePass}
                      </code>
                    </div>
                  </div>

                  {/* Password Modification Form */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={inputVal}
                        onChange={(e) => setPasswordInputs({ ...passwordInputs, [acc.id]: e.target.value })}
                        placeholder="Nhập mật khẩu mới (ví dụ: 123456)..."
                        className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordFlags({ ...showPasswordFlags, [acc.id]: !showPass })}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        title={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleResetToDefault(acc.id, acc.name)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
                        title="Đặt về mật khẩu mặc định (123456)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Mặc định</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSavePassword(acc.id, acc.name)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu Mật Khẩu</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Tổng số tài khoản: <strong>{allAccounts.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
