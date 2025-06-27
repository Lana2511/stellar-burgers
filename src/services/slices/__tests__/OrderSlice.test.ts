import { orderReducer, clearOrder } from '../OrderSlice';
import { sendOrder, getOrder } from '../OrderSlice';
import { TOrder } from '@utils-types';

const testOrder_1: TOrder = {
  _id: '111',
  status: 'pending',
  name: 'order_1',
  createdAt: '2025-01-10T12:00:00.000Z',
  updatedAt: '2025-01-17T12:00:00.000Z',
  number: 1,
  ingredients: ['ingredient_1', 'ingredient_2']
};

const testOrder_2: TOrder = {
  _id: '222',
  status: 'done',
  name: 'order_2',
  createdAt: '2025-02-05T14:30:00.000Z',
  updatedAt: '2025-02-06T09:15:00.000Z',
  number: 2,
  ingredients: ['ingredient_3', 'ingredient_4', 'ingredient_5']
};

const initialState = {
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

describe('orderSlice reducer', () => {
  it('при отправке заказа (sendOrder.pending) флаг orderRequest становится true, а loading и error сбрасываются', () => {
    const action = { type: sendOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      loading: false,
      error: null
    });
  });

  it('после успешной отправки заказа (sendOrder.fulfilled) в orderModalData записываются данные заказа, а флаг orderRequest сбрасывается в false', () => {
    const action = {
      type: sendOrder.fulfilled.type,
      payload: { order: testOrder_1 }
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      orderModalData: testOrder_1,
      loading: false
    });
  });

  it('при ошибке при отправке заказа (sendOrder.rejected) в error записывается сообщение об ошибке, а orderRequest и loading становятся false', () => {
    const action = {
      type: sendOrder.rejected.type,
      payload: 'Order failed'
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      loading: false,
      error: 'Order failed'
    });
  });

  it('при запросе информации о заказе (getOrder.pending) флаг loading устанавливается в true, а error сбрасывается', () => {
    const action = { type: getOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('при успешном получении заказа (getOrder.fulfilled) в orderModalData записывается полученный заказ, а loading сбрасывается в false', () => {
    const action = {
      type: getOrder.fulfilled.type,
      payload: { orders: [testOrder_2] }
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderModalData: testOrder_2,
      loading: false
    });
  });

  it('при ошибке при получении заказа (getOrder.rejected) в error сохраняется сообщение об ошибке, а loading становится false', () => {
    const action = {
      type: getOrder.rejected.type,
      payload: 'Order fetch error'
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Order fetch error'
    });
  });

  it('при вызове clearOrder() стор сбрасывается в исходное состояние: все данные, ошибки и флаги загрузки удаляются', () => {
    const stateWithData = {
      orderRequest: true,
      orderModalData: testOrder_1,
      loading: true,
      error: 'Some error'
    };
    const state = orderReducer(stateWithData, clearOrder());
    expect(state).toEqual(initialState);
  });
});
