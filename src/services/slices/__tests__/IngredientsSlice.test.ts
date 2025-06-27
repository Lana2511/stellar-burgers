import { ingredientReducer } from '../IngredientsSlice';
import { fetchIngredients } from '../IngredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  test('должен установить loading в true при fetchIngredients.pending', () => {
    const nextState = ingredientReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.data).toEqual([]);
  });

  test('должен сохранить данные и установить loading в false при fetchIngredients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const nextState = ingredientReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.data).toEqual(mockIngredients);
    expect(nextState.error).toBeNull();
  });

  test('должен сохранить ошибку и установить loading в false при fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';

    const nextState = ingredientReducer(
      initialState,
      fetchIngredients.rejected(null, '', undefined, errorMessage)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
    expect(nextState.data).toEqual([]);
  });
});
