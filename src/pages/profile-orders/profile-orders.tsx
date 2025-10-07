import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector((state) => state.order.userOrders);
  const user = useSelector((state) => state.user.user);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (user && !fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user]);
  return <ProfileOrdersUI orders={userOrders} />;
};
