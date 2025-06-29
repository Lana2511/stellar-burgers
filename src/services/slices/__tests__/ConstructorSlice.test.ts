import {
  constructorReducer,
  addIngredientToConstructor,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../ConstructorSlice';

import { TConstructorIngredient } from '../../../utils/types';

const bunIngredient: TConstructorIngredient = {
    id: 'bun-unique-id-1',
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const ingredient1: TConstructorIngredient = {
    id: 'ing1',
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const ingredient2: TConstructorIngredient = {
    id: 'ing2',
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };

  const ingredient3: TConstructorIngredient = {
    id: 'ing3',
    _id: '12345',
    name: 'Соус',
    type: 'sauce',
    proteins: 4,
    fat: 50,
    carbohydrates: 47,
    calories: 500,
    price: 200,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };


describe('constructorSlice reducer', () => {
  test('должен добавлять булку и ингредиенты', () => {
    let state = constructorReducer(
      undefined,
      addIngredientToConstructor(bunIngredient)
    );
    expect(state.bun).toEqual(bunIngredient);

    state = constructorReducer(state, addIngredientToConstructor(ingredient1));
    state = constructorReducer(state, addIngredientToConstructor(ingredient2));

    expect(state.ingredients.length).toBe(2);
    expect(state.ingredients[0]).toEqual(ingredient1);
    expect(state.ingredients[1]).toEqual(ingredient2);
  });

  test('должен удалять ингредиент по id', () => {
    const initialState = {
      bun: bunIngredient,
      ingredients: [ingredient1, ingredient2, ingredient3]
    };

    const state = constructorReducer(initialState, removeIngredient('id-2'));

    expect(state.ingredients.length).toBe(3);
    expect(
      state.ingredients.find((item) => item.id === 'id-2')
    ).toBeUndefined();
  });

  test('должен перемещать ингредиент вверх', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient3]
    };

    const state = constructorReducer(initialState, moveIngredientUp(2));

    expect(state.ingredients[1]).toEqual(ingredient3);
    expect(state.ingredients[2]).toEqual(ingredient2);
  });

  test('должен перемещать ингредиент вниз', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient3]
    };

    const state = constructorReducer(initialState, moveIngredientDown(0));

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });
});
