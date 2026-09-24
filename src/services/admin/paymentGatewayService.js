import axiosClient from '../../api/axiosClient';
import { asCollection } from './pagination';

export const getPaymentGateways = async () => (
  asCollection(await axiosClient.get('/admin/cong-thanh-toan'), 'cổng thanh toán')
);

export const updatePaymentGateway = (provider, enabled) => (
  axiosClient.patch(`/admin/cong-thanh-toan/${provider}`, { enabled })
);

