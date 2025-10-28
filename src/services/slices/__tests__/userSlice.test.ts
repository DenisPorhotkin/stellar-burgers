import userReducer, {
  initialState,
  loginUser,
  registerUser,
  logoutUser,
  checkUserAuth,
  updateUser,
  setAuthChecked,
  clearError
} from '../userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('User Slice', () => {
  it('должен вернуть исходное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('registerUser', () => {
    it('должен установить loading в состояние true в режиме ожидания', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен показать пользователя при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен показать ошибку при отклонении', () => {
      const errorMessage = 'Регистрация не удалась';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('loginUser', () => {
    it('должен установить loading в состояние true в режиме ожидания', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен показать пользователя при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен показать ошибку при отклонении', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('должен обновить данные пользователя по выполнении', () => {
      const initialUser = { email: 'old@example.com', name: 'Old User' };
      const updatedUser = { email: 'new@example.com', name: 'New User' };
      
      const stateWithUser = { ...initialState, user: initialUser };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      
      const state = userReducer(stateWithUser, action);
      
      expect(state.user).toEqual(updatedUser);
      expect(state.user?.email).toBe('new@example.com');
      expect(state.user?.name).toBe('New User');
    });

    it('не должно влиять на другие свойства состояния при обновлении', () => {
      const initialUser = { email: 'old@example.com', name: 'Old User' };
      const updatedUser = { email: 'new@example.com', name: 'New User' };
      
      const stateWithUser = { 
        ...initialState, 
        user: initialUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };
      
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      
      const state = userReducer(stateWithUser, action);
      
      expect(state.user).toEqual(updatedUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('checkUserAuth', () => {
    it('должен установить isAuthChecked в значение true при выполнении', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('должен установить isAuthChecked на значение true, а user на значение null при отклонении', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = userReducer(initialState, action);
      
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('logoutUser', () => {
    it('должен очистить пользователя при выполнении', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);
      
      expect(state.user).toBeNull();
    });
  });

  describe('setAuthChecked', () => {
    it('должен установить isAuthChecked true', () => {
      const state = userReducer(initialState, setAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('clearError', () => {
    it('должен очистить ошибку', () => {
      const stateWithError = { ...initialState, error: 'Error' };
      const state = userReducer(stateWithError, clearError());
      
      expect(state.error).toBeNull();
    });
  });
});