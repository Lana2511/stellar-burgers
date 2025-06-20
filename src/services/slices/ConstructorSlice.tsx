import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      payload.type === 'bun'
        ? (state.bun = payload)
        : state.ingredients.push(payload);
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const ingredientToMove = state.ingredients[index];
        state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, ingredientToMove);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const ingredientToMove = state.ingredients[index];
        state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, ingredientToMove);
      }
    },

    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== payload
      );
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredientToConstructor,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
