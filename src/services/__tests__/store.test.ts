import store, { rootReducer } from '../store';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as userInitialState } from '../slices/userSlice';
import { initialState as orderInitialState } from '../slices/orderSlice';

describe('Root Reducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined состоянием и неизвестным действием', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(result).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      user: userInitialState,
      order: orderInitialState
    });
  });

  it('должен обрабатывать первоначальную конфигурацию магазина', () => {
    const state = store.getState();
    
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.burgerConstructor).toEqual(constructorInitialState);
    expect(state.user).toEqual(userInitialState);
    expect(state.order).toEqual(orderInitialState);
  });
});