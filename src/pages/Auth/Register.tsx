import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Info, UserPlus, ArrowLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Evaluate password strength: 0 to 4
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: 'Chưa nhập', color: 'text-[#5f5e5e]' };
    if (strengthScore === 1) return { text: 'Yếu', color: 'text-red-500' };
    if (strengthScore === 2) return { text: 'Trung bình', color: 'text-amber-500' };
    if (strengthScore === 3) return { text: 'Khá', color: 'text-blue-500' };
    return { text: 'Mạnh', color: 'text-emerald-600' };
  }, [password, strengthScore]);

  const isPasswordMatched = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    if (!isPasswordMatched) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    if (!termsAccepted) {
      toast.error('Vui lòng đồng ý với Điều khoản sử dụng & Chính sách bảo mật');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('accessToken', 'mock-register-jwt-token');
      localStorage.setItem('user', JSON.stringify({ email, name: fullName, role: 'CUSTOMER' }));
      toast.success('Đăng ký tài khoản thành công!');
      navigate('/');
    }, 800);
  };

  const handleGoogleSignup = () => {
    toast.loading('Đang kết nối tới Google OAuth...', { duration: 1500 });
    setTimeout(() => {
      localStorage.setItem('accessToken', 'mock-google-register-token');
      localStorage.setItem('user', JSON.stringify({ email: 'new.google.user@gmail.com', name: 'Google New User', role: 'CUSTOMER' }));
      toast.success('Đăng ký với Google thành công!');
      navigate('/');
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
        <div className="w-full max-w-[500px]">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#e4e2e2] transition-all">
            {/* Header Icon & Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#ae0011] mb-2 border border-red-100">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1">Đăng ký tài khoản</h1>
              <p className="text-xs text-[#5f5e5e]">
                Tạo tài khoản để đặt vé nhanh chóng và quản lý lịch sử xem phim tại NexCinema
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-[#1b1c1c]">
                  Họ và tên <span className="text-[#ae0011] font-bold">*</span>
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                  <User className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-[#1b1c1c]">
                  Email <span className="text-[#ae0011] font-bold">*</span>
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

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-[#1b1c1c]">
                  Số điện thoại <span className="text-[#ae0011] font-bold">*</span>
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                  <Phone className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-[#1b1c1c]">
                  Mật khẩu <span className="text-[#ae0011] font-bold">*</span>
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                  <Lock className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors p-1"
                    aria-label="Hiển thị mật khẩu"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5f5e5e]">Độ bảo mật:</span>
                    <span className={`font-bold ${strengthLabel.color}`}>{strengthLabel.text}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
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
                      className={`h-full rounded-full transition-all duration-300 ${
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
                      className={`h-full rounded-full transition-all duration-300 ${
                        strengthScore >= 3
                          ? strengthScore === 3
                            ? 'bg-blue-500'
                            : 'bg-emerald-600'
                          : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strengthScore >= 4 ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-[#5f5e5e] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#5f5e5e]" />
                    <span>Gợi ý: từ 8 ký tự trở lên, gồm chữ hoa, chữ thường và chữ số</span>
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-[#1b1c1c]">
                  Xác nhận mật khẩu <span className="text-[#ae0011] font-bold">*</span>
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f5f3f3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d71920]/30 transition-all border border-[#e4e2e2]">
                  <Lock className="w-5 h-5 absolute left-3 text-[#5f5e5e] pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-[#1b1c1c] placeholder:text-gray-400 focus:outline-none rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors p-1"
                    aria-label="Hiển thị xác nhận mật khẩu"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isPasswordMatched && (
                  <span className="text-xs text-red-500 font-semibold mt-0.5">
                    Mật khẩu xác nhận không trùng khớp
                  </span>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 mt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#d71920] focus:ring-[#d71920] accent-[#d71920]"
                />
                <label htmlFor="terms" className="text-xs text-[#1b1c1c] leading-relaxed cursor-pointer select-none">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-[#d71920] hover:underline font-semibold">
                    Điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-[#d71920] hover:underline font-semibold">
                    Chính sách bảo mật
                  </a>{' '}
                  của NexCinema.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full h-px bg-[#e4e2e2]"></div>
              <span className="absolute px-3 bg-white text-xs font-semibold text-[#5f5e5e] uppercase">
                Hoặc
              </span>
            </div>

            {/* Social Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full h-11 rounded-lg bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] font-semibold text-xs flex items-center justify-center gap-3 transition-all border border-[#e4e2e2] cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

            {/* Link to Login */}
            <div className="mt-6 text-center text-xs text-[#5f5e5e]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-[#d71920] font-bold hover:underline inline-flex items-center gap-0.5 ml-1">
                <span>Đăng nhập ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
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

export default Register;
