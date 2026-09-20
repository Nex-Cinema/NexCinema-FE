import axiosClient from '../../api/axiosClient';

export const getPaymentGateways = () => axiosClient.get('/admin/cong-thanh-toan');

export const updatePaymentGateway = (provider, enabled) => (
  axiosClient.patch(`/admin/cong-thanh-toan/${provider}`, { enabled })
);

