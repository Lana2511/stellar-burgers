import { authReducer, markAuthChecked, setCurrentUser } from '../UserSlice';
import {
  loginUser,
  createUserAccount,
  logOutUser,
  fetchUserOrders
} from '../UserSlice';

const initialState = {
  isAuthVerified: false,
  orders: [],
  user: null,
  isLoading: false,
  errorMessage: null
};

describe('authSlice reducer', () => {
  it('должен установить isLoading в true при loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.errorMessage).toBeNull();
  });

  it('должен установить пользователя и isAuthVerified при loginUser.fulfilled', () => {
    const mockUser = { email: 'test@example.com', name: 'Test' };
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = authReducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthVerified).toBe(true);
  });

  it('должен установить ошибку и isAuthVerified при loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Ошибка авторизации' }
    };
    const state = authReducer({ ...initialState, isLoading: true }, action);
    expect(state.errorMessage).toBe('Ошибка авторизации');
    expect(state.isLoading).toBe(false);
    expect(state.isAuthVerified).toBe(true);
  });

  it('должен записать пользователя при createUserAccount.fulfilled', () => {
    const user = { email: 'new@example.com', name: 'New' };
    const action = { type: createUserAccount.fulfilled.type, payload: user };
    const state = authReducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthVerified).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('должен очистить user при logOutUser.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: { email: 'logout@example.com', name: 'User' },
      isLoading: true
    };
    const action = { type: logOutUser.fulfilled.type };
    const state = authReducer(stateWithUser, action);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('должен установить заказы в orders при fetchUserOrders.fulfilled', () => {
    const mockOrders = [{ _id: '1', name: 'Заказ 1' }];
    const action = { type: fetchUserOrders.fulfilled.type, payload: mockOrders };
    const state = authReducer({ ...initialState, isLoading: true }, action);
    expect(state.orders).toEqual(mockOrders);
    expect(state.isLoading).toBe(false);
  });

  it('markAuthChecked должен установить isAuthVerified: true', () => {
    const state = authReducer(initialState, markAuthChecked());
    expect(state.isAuthVerified).toBe(true);
  });

  it('setCurrentUser должен установить пользователя', () => {
    const user = { email: 'test@example.com', name: 'Test' };
    const state = authReducer(initialState, setCurrentUser(user));
    expect(state.user).toEqual(user);
  });
});
