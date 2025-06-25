import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredientIds: string[]) => await orderBurgerApi(ingredientIds)
);

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (number: number) => await getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderModalData = null;
      state.orderRequest = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.loading = false;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload?.orders?.[0];
        state.loading = false;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
