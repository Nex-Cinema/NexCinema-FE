import axiosClient from '../../api/axiosClient';

export const createCounterSale = (payload) =>
  axiosClient.post('/admin/ban-ve-tai-quay', payload);

export const recreateCounterPayosLink = (maPhieuDat) =>
  axiosClient.post(`/admin/ban-ve-tai-quay/${maPhieuDat}/payos`);

export const getCounterPayosStatus = (maGiaoDich) =>
  axiosClient.get(`/admin/ban-ve-tai-quay/payos/${maGiaoDich}/status`);
