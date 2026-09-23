import axiosClient from './axiosClient';
import {
  UpdateCustomerProfilePayload,
  ChangePasswordPayload,
} from '@/types/api.type';

export const getCustomerProfile = (): Promise<any> => {
  return axiosClient.get('/tai-khoan/thong-tin');
};

export const updateCustomerProfile = (payload: UpdateCustomerProfilePayload): Promise<any> => {
  return axiosClient.put('/tai-khoan/thong-tin', payload);
};

export const changeCustomerPassword = (payload: ChangePasswordPayload): Promise<any> => {
  return axiosClient.put('/tai-khoan/doi-mat-khau', payload);
};
