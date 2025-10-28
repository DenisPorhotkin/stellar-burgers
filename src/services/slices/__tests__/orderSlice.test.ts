import orderReducer, {
  initialState,
  createOrder,
  fetchFeeds,
  clearOrder,
  setHighlightedOrder
} from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ing1', 'ing2']
};

describe('Order Slice', () => {
  it('должен вернуть исходное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('должен установить orderRequest в значение true в режиме ожидания', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен установить данные заказа и подсветить заказ на выполнение', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.highlightedOrder).toBe(mockOrder.number);
    });

    it('должен установить ошибку при отклонении', () => {
      const errorMessage = 'Не удалось создать заказ';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchFeeds', () => {
    it('должен установить loading в состояние true в режиме ожидания', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('должен установить данные каналов на выполненные', () => {
      const mockResponse = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockResponse
      };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.feeds).toEqual([mockOrder]);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });

  describe('clearOrder', () => {
    it('должен очистить заказ и orderModalData', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderModalData: mockOrder
      };
      const state = orderReducer(stateWithOrder, clearOrder());
      
      expect(state.order).toBeNull();
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('setHighlightedOrder', () => {
    it('должен установить выделенный номер заказа', () => {
      const orderNumber = 12345;
      const state = orderReducer(initialState, setHighlightedOrder(orderNumber));
      
      expect(state.highlightedOrder).toBe(orderNumber);
    });
  });
});