import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/login", {
        TenDangNhap: formData.username,
        MatKhau: formData.password,
      });

      const { taiKhoan, tokens } = response;

      if (!taiKhoan || !tokens) {
        throw new Error("Phản hồi đăng nhập không hợp lệ từ máy chủ");
      }

      // Store tokens and metadata
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("userRole", taiKhoan.VaiTro);
      localStorage.setItem("userName", taiKhoan.HoTen);
      localStorage.setItem("userCode", taiKhoan.TenDangNhap);
      localStorage.setItem("userInfo", JSON.stringify(taiKhoan));

      toast.success("Đăng nhập thành công!");

      // Role-based redirect
      const from = location.state?.from;
      const role = taiKhoan.VaiTro;

      if (role === "CUSTOMER") {
        navigate(from || "/", { replace: true });
      } else if (role === "ADMIN") {
        const adminTarget = from && from.startsWith("/admin") ? from : "/admin";
        navigate(adminTarget, { replace: true });
      } else {
        // Any role outside the current CUSTOMER/ADMIN scope is forbidden.
        navigate("/403", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[720px] rounded-2xl bg-white px-6 py-10 shadow-sm ring-1 ring-black/5 sm:px-18 sm:py-12">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f5f3f3] text-(--client-primary)"><Film size={29} fill="currentColor" /></span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-neutral-950">Đăng nhập</h1>
        <p className="mt-2 text-sm text-neutral-500">Chào mừng bạn trở lại với trải nghiệm điện ảnh NexCinema</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5 text-left">
        <label className="block space-y-2 text-sm font-semibold text-neutral-900">Tên đăng nhập <span className="text-(--client-primary)">*</span>
          <span className="relative block"><User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500" /><input type="text" required placeholder="Nhập tên đăng nhập" value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} disabled={isLoading} className="h-13 w-full rounded-xl bg-[#f5f3f3] pl-12 pr-4 font-normal text-neutral-950 outline-none ring-1 ring-transparent focus:bg-white focus:ring-(--client-primary)" /></span>
        </label>
        <label className="block space-y-2 text-sm font-semibold text-neutral-900">Mật khẩu
          <span className="relative block"><Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500" /><input type={showPassword ? 'text' : 'password'} required placeholder="Nhập mật khẩu của bạn" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} disabled={isLoading} className="h-13 w-full rounded-xl bg-[#f5f3f3] pl-12 pr-12 font-normal text-neutral-950 outline-none ring-1 ring-transparent focus:bg-white focus:ring-(--client-primary)" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500" aria-label="Ẩn hoặc hiện mật khẩu">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span>
        </label>
        <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-neutral-500"><input type="checkbox" className="size-4 accent-(--client-primary)" />Ghi nhớ đăng nhập</label><Link to="/forgot-password" className="font-semibold text-(--client-primary) hover:underline">Quên mật khẩu?</Link></div>
        <button type="submit" disabled={isLoading} className="client-primary-button h-13 w-full text-base">{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}<ArrowRight size={19} /></button>
      </form>
      <p className="mt-8 text-center text-sm text-neutral-500">Chưa có tài khoản? <Link to="/register" className="font-semibold text-(--client-primary) hover:underline">Đăng ký ngay</Link></p>
    </section>
  );
};

export default Login;
