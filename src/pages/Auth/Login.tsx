import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    setIsLoading(true);
    // Mock login logic
    setTimeout(() => {
      setIsLoading(false);
      const mockUser = { email, name: email.split('@')[0], role: 'CUSTOMER' };
      login('mock-jwt-token-123456', mockUser);
      toast.success('Đăng nhập thành công!');
      navigate(redirectUrl);
    }, 600);
  };

  const handleGoogleLogin = () => {
    toast.loading('Đang kết nối tới Google OAuth...', { duration: 1500 });
    setTimeout(() => {
      const mockUser = { email: 'user.google@gmail.com', name: 'Google User', role: 'CUSTOMER' };
      login('mock-google-jwt-token', mockUser);
      toast.success('Đăng nhập Google thành công!');
      navigate(redirectUrl);
    }, 1500);
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
        <div className="w-full max-w-[540px]">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#e4e2e2] transition-all">
            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#d71920] mb-3 border border-red-100">
                <Film className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1 whitespace-nowrap">Đăng nhập</h1>
              <p className="text-xs text-[#5f5e5e]">
                Chào mừng bạn trở lại với trải nghiệm điện ảnh NexCinema
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-[#1b1c1c] flex items-center justify-between">
                  <span>Email <span className="text-[#ae0011] font-bold">*</span></span>
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-[#1b1c1c]">
                  Mật khẩu
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                  <Lock className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors p-1"
                    aria-label="Ẩn hoặc hiện mật khẩu"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Utility Row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#d71920] focus:ring-[#d71920] accent-[#d71920]"
                  />
                  <span className="text-xs text-[#5f5e5e]">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#d71920] hover:text-[#ae0011] transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 rounded-lg bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-base tracking-normal flex items-center justify-center shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full h-px bg-[#e4e2e2]"></div>
              <span className="absolute px-3 bg-white text-xs font-medium text-[#5f5e5e] uppercase">
                Hoặc
              </span>
            </div>

            {/* Social Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-lg bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] font-medium text-base flex items-center justify-center gap-3 transition-all border border-[#e4e2e2] cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-[#5f5e5e]">
              Chưa có tài khoản?
              <Link to="/register" className="text-[#d71920] font-bold hover:underline ml-1">
                Đăng ký ngay
              </Link>
            </div>
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

export default Login;
