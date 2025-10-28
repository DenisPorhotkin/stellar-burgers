import React from 'react';
import styles from './order-details.module.css';
import doneImg from '../../../images/done.svg';
import { OrderDetailsUIProps } from './type';

export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber
}) => (
  <div data-testid='order-details'>
    <h2
      className={`${styles.title} text text_type_digits-large mt-2 mb-4`}
      data-testid='order-number'
    >
      {orderNumber}
    </h2>
    <p
      className='text text_type_main-medium'
      data-testid='order-identifier-text'
    >
      идентификатор заказа
    </p>
    <img
      className={styles.img}
      src={doneImg}
      alt='изображение статуса заказа.'
      data-testid='order-done-image'
    />
    <p
      className='text text_type_main-default mb-1'
      data-testid='order-cooking-text'
    >
      Ваш заказ начали готовить
    </p>
    <p
      className={`${styles.text} text text_type_main-default`}
      data-testid='order-waiting-text'
    >
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);
