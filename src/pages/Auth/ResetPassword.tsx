import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, Shield, ArrowLeft, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Evaluate strength score (0-4)
  const strengthScore = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword) || newPassword.length >= 12) score++;
    return score;
  }, [newPassword]);

  const isMatched = useMemo(() => {
    if (!confirmPassword) return false;
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!');
      return;
    }
    if (!isMatched) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1b1c1c] font-sans antialiased">
      {/* ── HEADER ── */}
      <header className="w-full bg-white/80 backdrop-blur-xl shadow-xs border-b border-[#e4e2e2]">
        <div className="h-16 max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform active:scale-95">
            <span className="font-extrabold text-2xl tracking-tight text-[#ae0011]">NexCinema</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[#5f5e5e] hover:text-[#ae0011] transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-center py-8 lg:py-12">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e4e2e2] transition-all relative">
            <div className="h-1.5 w-full bg-[#d71920]" />

            {!isSuccess ? (
              /* State 1: Reset Password Form */
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-[#ae0011] flex items-center justify-center mb-3 border border-red-100 shadow-xs">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1">Đặt lại mật khẩu</h1>
                  <p className="text-xs text-[#5f5e5e] max-w-[360px]">
                    Tạo mật khẩu mới an toàn cho tài khoản của bạn để tiếp tục đặt vé.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* New Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="newPassword" className="text-xs font-semibold text-[#1b1c1c]">
                      Mật khẩu mới <span className="text-[#ae0011] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                      <Lock className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors p-1"
                        aria-label="Ẩn hiện mật khẩu"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    <div className="mt-1 grid grid-cols-4 gap-1.5 w-full h-1.5 rounded-full overflow-hidden bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore >= 1
                            ? strengthScore === 1
                              ? 'bg-red-500'
                              : strengthScore === 2
                              ? 'bg-amber-500'
                              : strengthScore === 3
                              ? 'bg-blue-500'
                              : 'bg-emerald-600'
                            : 'bg-gray-200'
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore >= 2
                            ? strengthScore === 2
                              ? 'bg-amber-500'
                              : strengthScore === 3
                              ? 'bg-blue-500'
                              : 'bg-emerald-600'
                            : 'bg-gray-200'
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore >= 3
                            ? strengthScore === 3
                              ? 'bg-blue-500'
                              : 'bg-emerald-600'
                            : 'bg-gray-200'
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore >= 4 ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-semibold text-[#1b1c1c]">
                      Xác nhận mật khẩu mới <span className="text-[#ae0011] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                      <Lock className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors p-1"
                        aria-label="Ẩn hiện mật khẩu xác nhận"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Match Feedback */}
                    {confirmPassword.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold mt-0.5">
                        {isMatched ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mật khẩu trùng khớp
                          </span>
                        ) : (
                          <span className="text-red-500">Mật khẩu xác nhận không trùng khớp</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                  >
                    <span>{isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* State 2: Success Confirmation */
              <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-[#1b1c1c]">Đặt lại mật khẩu thành công!</h2>
                  <p className="text-xs text-[#5f5e5e] max-w-[340px]">
                    Mật khẩu của bạn đã được cập nhật an toàn. Bạn có thể đăng nhập ngay bây giờ để tiếp tục chọn suất chiếu yêu thích.
                  </p>
                </div>

                <div className="w-full bg-[#f5f3f3] rounded-lg p-3.5 flex items-center gap-3 text-left border border-[#e4e2e2]">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#d71920] shadow-xs shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1b1c1c]">Tài khoản đã bảo vệ</span>
                    <span className="text-[11px] text-[#5f5e5e]">Phiên đăng nhập cũ đã được vô hiệu hóa</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="w-full h-12 bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Đăng nhập ngay</span>
                  <LogIn className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-[#f5f3f3] py-4 border-t border-[#e4e2e2]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#5f5e5e]">
          <div>© 2024 NexCinema Vietnam. Tất cả quyền được bảo lưu.</div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Hotline: 1900 8888</span>
            <a href="mailto:support@nexcinema.vn" className="hover:text-[#1b1c1c]">
              support@nexcinema.vn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
