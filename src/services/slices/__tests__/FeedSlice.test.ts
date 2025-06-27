import { feedReducer, initialState } from '../FeedSlice';
import { getFeed } from '../FeedSlice';
import { TOrder } from '@utils-types';

const testOrders: TOrder[] = [
  {
    _id: 'order1',
    number: 1,
    name: 'Test Order 1',
    status: 'done',
    createdAt: '2025-06-01',
    updatedAt: '2025-06-01',
    ingredients: ['ingr1', 'ingr2']
  },
  {
    _id: 'order2',
    number: 2,
    name: 'Test Order 2',
    status: 'pending',
    createdAt: '2025-06-02',
    updatedAt: '2025-06-02',
    ingredients: ['ingr3', 'ingr4']
  }
];

describe('feedSlice reducer', () => {
  it('должен установить loading=true при getFeed.pending', () => {
    const action = { type: getFeed.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записать данные при getFeed.fulfilled', () => {
    const actionPayload = {
      orders: testOrders,
      total: 100,
      totalToday: 25
    };
    const action = { type: getFeed.fulfilled.type, payload: actionPayload };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(testOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(25);
  });

  it('должен записать ошибку при getFeed.rejected', () => {
    const action = {
      type: getFeed.rejected.type,
      error: { message: 'Ошибка при загрузке фида' }
    };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке фида');
  });
});
