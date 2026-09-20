import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Copy, CreditCard, RefreshCw, ShieldCheck, Webhook } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { AdminErrorState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import { getPaymentGateways, updatePaymentGateway } from '../../services/admin/paymentGatewayService';
import { getErrorMessage, showError, showSuccess } from '../../utils/toastHelper';

const endpointLabels = {
  returnUrl: 'Return URL',
  cancelUrl: 'Cancel URL',
  webhookUrl: 'Webhook URL',
  callbackUrl: 'Gateway callback',
  frontendReturnUrl: 'Frontend return',
  ipnUrl: 'IPN URL',
};

const EndpointRow = ({ label, value }) => {
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    showSuccess(`Đã sao chép ${label}`);
  };
  return (
    <div className="grid gap-2 border-t border-neutral-100 py-3 first:border-t-0 sm:grid-cols-[140px_minmax(0,1fr)_36px] sm:items-center">
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <code className="truncate rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-700" title={value}>{value}</code>
      <button type="button" onClick={copy} className="admin-icon-button" aria-label={`Sao chép ${label}`} title={`Sao chép ${label}`}><Copy size={15} /></button>
    </div>
  );
};

const GatewayCard = ({ gateway, updating, onToggle }) => (
  <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
    <header className="flex flex-col gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-red-50 text-(--admin-brand)"><CreditCard size={21} strokeWidth={1.7} /></span>
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-neutral-950">{gateway.label}</h2><StatusBadge status={gateway.ready ? 'Active' : gateway.enabled ? 'Pending' : 'Inactive'} /></div>
          <p className="mt-1 text-xs text-neutral-500">Môi trường <strong className="uppercase text-neutral-700">{gateway.environment}</strong> · secret được quản lý ngoài database</p>
        </div>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-neutral-700">
        <span>{gateway.enabled ? 'Đang bật' : 'Đang tắt'}</span>
        <input className="peer sr-only" type="checkbox" checked={gateway.enabled} disabled={updating} onChange={(event) => onToggle(gateway, event.target.checked)} />
        <span className="relative h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-(--admin-brand) peer-disabled:opacity-50 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
      </label>
    </header>

    <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_230px]">
      <div>
        <div className={`mb-3 flex items-start gap-3 rounded-lg p-3 ${gateway.configured ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
          {gateway.configured ? <CheckCircle2 className="mt-0.5 shrink-0" size={17} /> : <AlertTriangle className="mt-0.5 shrink-0" size={17} />}
          <div><strong className="block text-sm">{gateway.configured ? 'Credential đã sẵn sàng' : 'Thiếu credential máy chủ'}</strong><p className="mt-0.5 text-xs opacity-80">{gateway.configured ? 'Các biến bắt buộc đã có giá trị.' : `Cần cấu hình: ${gateway.requiredSecrets.join(', ')}`}</p></div>
        </div>
        <div className="rounded-lg ring-1 ring-neutral-200">
          {Object.entries(gateway.endpoints).map(([key, value]) => <EndpointRow key={key} label={endpointLabels[key] || key} value={value} />)}
        </div>
      </div>

      <aside className="rounded-lg bg-neutral-950 p-4 text-white">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"><Activity size={15} /> Giao dịch</div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-400">Thành công</dt><dd className="font-bold text-emerald-400">{gateway.transactions.succeeded}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-400">Đang chờ</dt><dd className="font-bold text-amber-300">{gateway.transactions.pending}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-400">Thất bại</dt><dd className="font-bold text-red-400">{gateway.transactions.failed}</dd></div>
        </dl>
      </aside>
    </div>
  </article>
);

const PaymentGateways = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState('');

  const load = async () => {
    setLoading(true);
    setError(false);
    try { setGateways(await getPaymentGateways()); } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;

    getPaymentGateways()
      .then((result) => { if (active) setGateways(result); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const toggle = async (gateway, enabled) => {
    setUpdating(gateway.provider);
    try {
      const updated = await updatePaymentGateway(gateway.provider, enabled);
      setGateways((current) => current.map((item) => item.provider === gateway.provider ? updated : item));
      showSuccess(`Đã ${enabled ? 'bật' : 'tắt'} ${gateway.label}`);
    } catch (requestError) {
      showError(getErrorMessage(requestError, `Không thể cập nhật ${gateway.label}`));
    } finally { setUpdating(''); }
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Cổng thanh toán" subtitle="Giám sát cấu hình vận hành. Credential luôn được giữ trong biến môi trường máy chủ." action={<AdminButton variant="outline" icon={RefreshCw} onClick={load} disabled={loading}>Làm mới</AdminButton>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 ring-1 ring-black/5"><ShieldCheck className="mb-3 text-emerald-600" size={20} /><strong className="block text-sm">Không lưu secret</strong><p className="mt-1 text-xs text-neutral-500">API key và checksum không bao giờ trả về trình duyệt.</p></div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-black/5"><Webhook className="mb-3 text-blue-600" size={20} /><strong className="block text-sm">Callback rõ ràng</strong><p className="mt-1 text-xs text-neutral-500">Tách callback backend và trang kết quả frontend.</p></div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-black/5"><Activity className="mb-3 text-(--admin-brand)" size={20} /><strong className="block text-sm">Chặn lỗi sớm</strong><p className="mt-1 text-xs text-neutral-500">Cổng tắt hoặc thiếu cấu hình sẽ không tạo giao dịch.</p></div>
      </div>
      {loading ? <AdminLoadingSkeleton rows={4} /> : error ? <AdminErrorState onRetry={load} /> : <div className="space-y-5">{gateways.map((gateway) => <GatewayCard key={gateway.provider} gateway={gateway} updating={updating === gateway.provider} onToggle={toggle} />)}</div>}
    </AdminLayout>
  );
};

export default PaymentGateways;
