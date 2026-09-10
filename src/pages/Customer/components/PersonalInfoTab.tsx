import React from 'react';
import { User, Lock, Phone, Calendar, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonalInfoTabProps {
  fullName: string;
  setFullName: (name: string) => void;
  email?: string;
  phone: string;
  setPhone: (phone: string) => void;
  birthday: string;
  setBirthday: (birthday: string) => void;
  gender: 'male' | 'female' | 'other';
  setGender: (gender: 'male' | 'female' | 'other') => void;
  onReset: () => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  fullName,
  setFullName,
  email,
  phone,
  setPhone,
  birthday,
  setBirthday,
  gender,
  setGender,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cập nhật thông tin cá nhân thành công!');
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#e4e2e2] animate-in fade-in duration-200">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#1b1c1c]">Thông tin cá nhân</h2>
        <p className="text-xs text-[#5f5e5e] mt-0.5">
          Quản lý hồ sơ định danh và thông tin liên hệ nhận vé điện tử của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="inputFullName" className="text-xs font-bold text-[#1b1c1c] block">
              Họ và tên
            </label>
            <div className="relative flex items-center">
              <input
                id="inputFullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
              />
              <User className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="inputEmail" className="text-xs font-bold text-[#1b1c1c] block">
                Địa chỉ Email
              </label>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã xác thực
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                id="inputEmail"
                type="email"
                readOnly
                value={email || 'hoangnam.movie@gmail.com'}
                className="w-full px-4 py-2.5 bg-[#efeded] text-gray-500 cursor-not-allowed rounded-xl text-sm font-medium focus:outline-none border border-gray-200"
              />
              <Lock className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="inputPhone" className="text-xs font-bold text-[#1b1c1c] block">
              Số điện thoại
            </label>
            <div className="relative flex items-center">
              <input
                id="inputPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
              />
              <Phone className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Birthday */}
          <div className="space-y-1.5">
            <label htmlFor="inputBirthday" className="text-xs font-bold text-[#1b1c1c] block">
              Ngày sinh
            </label>
            <div className="relative flex items-center">
              <input
                id="inputBirthday"
                type="text"
                placeholder="DD/MM/YYYY"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
              />
              <Calendar className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Gender Radio options */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#1b1c1c] block">Giới tính</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  className="accent-[#d71920] w-4 h-4"
                />
                <span className="text-xs font-semibold">Nam</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  className="accent-[#d71920] w-4 h-4"
                />
                <span className="text-xs font-semibold">Nữ</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                  className="accent-[#d71920] w-4 h-4"
                />
                <span className="text-xs font-semibold">Khác</span>
              </label>
            </div>
          </div>

          {/* Password Row */}
          <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-[#1b1c1c] block">Mật khẩu tài khoản</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-[#f5f3f3] rounded-xl gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <div className="text-sm font-bold tracking-widest text-[#1b1c1c]">••••••••••••</div>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Đã gửi liên kết đổi mật khẩu tới email của bạn!')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1b1c1c] text-xs font-bold shadow-xs transition-all whitespace-nowrap cursor-pointer border border-gray-200"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] text-xs font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Cập nhật thông tin</span>
          </button>
        </div>
      </form>
    </div>
  );
};
