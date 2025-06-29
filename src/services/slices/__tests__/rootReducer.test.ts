import store, { rootReducer } from '../../store';

describe('Правильная инициализация rootReducer', () => {
  it('возвращает начальное состояние, если действие неизвестно', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, unknownAction);
    const currentStoreState = store.getState();

    expect(initialState).toEqual(currentStoreState);
  });
});
