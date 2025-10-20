import ingredientsReducer, {
  initialState,
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'bun.jpg',
    image_large: 'bun-large.jpg',
    image_mobile: 'bun-mobile.jpg'
  },
  {
    _id: '2',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 15,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 100,
    image: 'ing.jpg',
    image_large: 'ing-large.jpg',
    image_mobile: 'ing-mobile.jpg'
  }
];

describe('Ingredients Slice', () => {
  it('должен вернуть исходное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('должен установить loading в состояние true в режиме ожидания', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен показать ingredients и loading в значение false при выполнении', () => {
      const action = { 
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен показать ошибку и loading на значение false при отклонении', () => {
      const errorMessage = 'Не удалось получить ингредиенты';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });
  });
});