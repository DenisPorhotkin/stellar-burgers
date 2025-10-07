import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const orders = useSelector((state) => state.order.feeds);
  const userOrders = useSelector((state) => state.order.userOrders);
  const currentOrder = useSelector((state) => state.order.currentOrder);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );
  const loading = useSelector((state) => state.order.loading);
  const isModal = Boolean(location.state?.background);

  useEffect(() => {
    if (number && !isModal) {
      const orderNumber = parseInt(number);
      const allOrders = [...orders, ...userOrders];
      const existingOrder = allOrders.find(
        (order) => order.number === orderNumber
      );

      if (!existingOrder) {
        dispatch(fetchOrderByNumber(orderNumber));
      }
    }
  }, [number, orders, userOrders, dispatch, isModal]);

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);
    const allOrders = [...orders, ...userOrders];

    const existingOrder = allOrders.find(
      (order) => order.number === orderNumber
    );
    if (existingOrder) return existingOrder;

    if (currentOrder && currentOrder.number === orderNumber)
      return currentOrder;

    return null;
  }, [number, orders, userOrders, currentOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading && !isModal) {
    return <Preloader />;
  }

  if (!orderInfo) {
    if (isModal) {
      return <Preloader />;
    }
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Заказ не найден</h2>
        <p>Заказ с номером {number} не существует</p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
