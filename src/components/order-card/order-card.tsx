import { FC, memo, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector, useDispatch } from '../../services/store';
import { clearHighlightedOrder } from '../../services/slices/orderSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const highlightedOrder = useSelector((state) => state.order.highlightedOrder);
  const dispatch = useDispatch();

  const isHighlighted = order.number === highlightedOrder;

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        dispatch(clearHighlightedOrder());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isHighlighted, dispatch]);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
      isHighlighted={isHighlighted}
    />
  );
});
