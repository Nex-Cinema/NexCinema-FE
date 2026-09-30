import { useState } from 'react';
import { ArrowRight, Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';

const inputClass = 'h-11 w-full rounded-lg bg-[#f5f3f3] pl-10 pr-3 text-sm text-neutral-950 outline-none ring-1 ring-transparent focus:bg-white focus:ring-(--client-primary)';

const Field = ({ label, icon: Icon, children }) => (
  <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
    {label} <span className="text-(--client-primary)">*</span>
    <span className="relative block"><Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />{children}</span>
  </label>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', phone: '', username: '', email: '', password: '', confirmPassword: '' });
  const update = (field) => (event) => setFormData((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Mật khẩu xác nhận không trùng khớp!');
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', {
        TenDangNhap: formData.username,
        MatKhau: formData.password,
        XacNhanMatKhau: formData.confirmPassword,
        HoTen: formData.name,
        Email: formData.email,
        SoDienThoai: formData.phone,
        GioiTinh: formData.gender === 'Nam' ? true : formData.gender === 'Nữ' ? false : null,
        NgaySinh: formData.dob || undefined,
      });
      const { tokens, taiKhoan } = response || {};
      if (tokens?.accessToken && tokens?.refreshToken && taiKhoan) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('userRole', taiKhoan.VaiTro);
        localStorage.setItem('userName', taiKhoan.HoTen);
        localStorage.setItem('userCode', taiKhoan.TenDangNhap);
        localStorage.setItem('userInfo', JSON.stringify(taiKhoan));
        toast.success('Đăng ký và đăng nhập thành công!');
        navigate('/');
      } else {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex max-h-[calc(100dvh-11rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <header className="shrink-0 border-b border-neutral-100 px-6 py-5 text-center sm:px-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950">Tạo <span className="text-(--client-primary)">tài khoản</span></h1>
        <p className="mt-1 text-sm text-neutral-500">Đăng ký để trải nghiệm dịch vụ đặt vé tốt nhất</p>
      </header>

      <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-10">
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <Field label="Họ và tên" icon={User}><input required value={formData.name} onChange={update('name')} placeholder="Họ và tên" className={inputClass} /></Field>
          <Field label="Ngày sinh" icon={Calendar}><input required type="date" value={formData.dob} onChange={update('dob')} className={inputClass} /></Field>
          <Field label="Giới tính" icon={User}><select required value={formData.gender} onChange={update('gender')} className={`${inputClass} cursor-pointer`}><option value="">Chọn giới tính</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></Field>
          <Field label="Số điện thoại" icon={Phone}><input required type="tel" value={formData.phone} onChange={update('phone')} placeholder="Số điện thoại" className={inputClass} /></Field>
          <Field label="Tên đăng nhập" icon={User}><input required value={formData.username} onChange={update('username')} placeholder="Tên đăng nhập" className={inputClass} /></Field>
          <Field label="Email" icon={Mail}><input required type="email" value={formData.email} onChange={update('email')} placeholder="name@example.com" className={inputClass} /></Field>
          <Field label="Mật khẩu" icon={Lock}><input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={update('password')} placeholder="Tối thiểu 6 ký tự" className={`${inputClass} pr-10`} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-label="Ẩn hoặc hiện mật khẩu">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></Field>
          <Field label="Xác nhận mật khẩu" icon={Lock}><input required type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={update('confirmPassword')} placeholder="Nhập lại mật khẩu" className={inputClass} /></Field>
        </div>
        <button type="submit" disabled={isLoading} className="client-primary-button mt-5 h-11 w-full">{isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}<ArrowRight size={18} /></button>
      </form>

      <footer className="shrink-0 border-t border-neutral-100 px-6 py-4 text-center text-sm text-neutral-500">Đã có tài khoản? <Link to="/login" className="font-semibold text-(--client-primary) hover:underline">Đăng nhập</Link></footer>
    </section>
  );
};

export default Register;
