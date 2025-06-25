import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchUserOrders } from '../../services/slices/UserSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const { orders, isAuthVerified } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthVerified && orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [isAuthVerified, orders, dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
