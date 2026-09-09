import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, Send, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Đã gửi yêu cầu đặt lại mật khẩu!');
    }, 700);
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#e4e2e2] transition-all relative overflow-hidden">
            <div className="h-1.5 w-full bg-[#d71920] absolute top-0 left-0" />

            {!isSubmitted ? (
              /* State 1: Reset Password Request Form */
              <div className="flex flex-col gap-6 pt-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#ae0011] mb-3 border border-red-100 shadow-xs">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1">Quên mật khẩu?</h1>
                  <p className="text-xs text-[#5f5e5e] max-w-[340px]">
                    Nhập địa chỉ email liên kết với tài khoản NexCinema của bạn để nhận liên kết đặt lại mật khẩu bảo mật.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-[#1b1c1c]">
                      Địa chỉ Email <span className="text-[#ae0011] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                      <Mail className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                  >
                    <span>{isLoading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex flex-col items-center gap-3 pt-2 border-t border-[#e4e2e2]">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-[#5f5e5e] hover:text-[#ae0011] transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại trang Đăng nhập</span>
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-[#5f5e5e]">
                    <PhoneCall className="w-3.5 h-3.5 text-[#d71920]" />
                    <span>Gặp sự cố? Liên hệ tổng đài vé 1900 8888</span>
                  </div>
                </div>
              </div>
            ) : (
              /* State 2: Success Confirmation Card */
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-[#1b1c1c]">Đã gửi liên kết khôi phục!</h2>
                  <p className="text-xs text-[#5f5e5e] max-w-[340px]">
                    Hệ thống đã gửi hướng dẫn đặt lại mật khẩu tới email <strong className="text-[#1b1c1c]">{email}</strong>. Vui lòng kiểm tra hòm thư (bao gồm cả thư rác / Spam).
                  </p>
                </div>

                <div className="w-full bg-[#f5f3f3] rounded-lg p-3 flex items-center gap-3 text-left border border-[#e4e2e2]">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#d71920] shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1b1c1c]">Bảo mật thông tin</span>
                    <span className="text-[11px] text-[#5f5e5e]">Liên kết khôi phục sẽ hết hạn sau 15 phút</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5 mt-2">
                  <Link
                    to="/login"
                    className="w-full h-11 bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Đăng nhập ngay</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-semibold text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors py-1"
                  >
                    Gửi lại email cho địa chỉ khác
                  </button>
                </div>
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

export default ForgotPassword;
