import constructorReducer, {
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun1',
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
};

const mockIngredient: TIngredient = {
  _id: 'ing1',
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
};

describe('Constructor Slice', () => {
  it('должен вернуть исходное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addBun', () => {
    it('должен добавить булочку в конструктор', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);
      
      expect(state.bun).toEqual(mockBun);
    });

    it('должен заменить существующую булочку при добавлении новой', () => {
      const firstState = constructorReducer(initialState, addBun(mockBun));
      const newBun = { ...mockBun, _id: 'bun2', name: 'New Bun' };
      const secondState = constructorReducer(firstState, addBun(newBun));
      
      expect(secondState.bun).toEqual(newBun);
      expect(secondState.bun?._id).toBe('bun2');
    });
  });

  describe('addIngredient', () => {
    it('должен добавить ингредиент в конструктор с уникальным идентификатором', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
    });

    it('должен добавить несколько ингредиентовs', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient));
      const secondIngredient = { ...mockIngredient, _id: 'ing2' };
      state = constructorReducer(state, addIngredient(secondIngredient));
      
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe('ing1');
      expect(state.ingredients[1]._id).toBe('ing2');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по идентификатору', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient));
      const ingredientId = state.ingredients[0].id;
      
      state = constructorReducer(state, removeIngredient(ingredientId));
      
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен ничего удалять, если идентификатор не найден', () => {
      let state = constructorReducer(initialState, addIngredient(mockIngredient));
      const originalIngredients = [...state.ingredients];
      
      state = constructorReducer(state, removeIngredient('non-existent-id'));
      
      expect(state.ingredients).toEqual(originalIngredients);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент на новую позицию', () => {
      const ingredients = [
        { ...mockIngredient, _id: '1', id: '1' },
        { ...mockIngredient, _id: '2', id: '2' },
        { ...mockIngredient, _id: '3', id: '3' }
      ];
      
      let state = { ...initialState, ingredients };
      state = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));
      
      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('3');
      expect(state.ingredients[2]._id).toBe('1');
    });

    it('не должно менять состояние при перемещении в ту же позицию', () => {
      const ingredients = [
        { ...mockIngredient, _id: '1', id: '1' },
        { ...mockIngredient, _id: '2', id: '2' }
      ];
      
      let state = { ...initialState, ingredients };
      const originalState = { ...state };
      state = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 0 }));
      
      expect(state).toEqual(originalState);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить все ингредиенты и булочку', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));
      
      state = constructorReducer(state, clearConstructor());
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});