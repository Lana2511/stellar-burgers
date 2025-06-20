import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  resetPasswordApi,
  getOrdersApi,
  TRegisterData
} from '../../utils/burger-api';
import { TUser, TOrder } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const verifyUserSession = createAsyncThunk(
  'auth/verifyUserSession',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      try {
        const userData = await getUserApi();
        dispatch(setCurrentUser(userData));
        return userData.user;
      } catch {
        localStorage.clear();
      }
    }
    dispatch(markAuthChecked());
    return null;
  }
);

export const createUserAccount = createAsyncThunk(
  'auth/createUserAccount',
  async (userData: TRegisterData) => {
    const result = await registerUserApi(userData);
    return result.user;
  }
);

export const logOutUser = createAsyncThunk('auth/signOutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
});

export const modifyUserDetails = createAsyncThunk(
  'auth/modifyUserDetails',
  async (userData: TRegisterData) => {
    const result = await updateUserApi(userData);
    return result.user;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'auth/fetchUserOrders',
  async () => {
    const ordersList = await getOrdersApi();
    return ordersList;
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (payload: { email: string }) => {
    const response = await forgotPasswordApi(payload);
    return response;
  }
);

export const applyNewPassword = createAsyncThunk(
  'auth/applyNewPassword',
  async (payload: { password: string; token: string }) => {
    const response = await resetPasswordApi(payload);
    return response;
  }
);

interface IUserState {
  isAuthVerified: boolean;
  orders: TOrder[];
  user: TUser | null;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: IUserState = {
  isAuthVerified: false,
  orders: [],
  user: null,
  isLoading: false,
  errorMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    markAuthChecked(state) {
      state.isAuthVerified = true;
    },
    setCurrentUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthVerified = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
        state.isAuthVerified = true;
      });
    builder
      .addCase(createUserAccount.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthVerified = true;
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
        state.isAuthVerified = true;
      });
    builder
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
      });
    builder
      .addCase(modifyUserDetails.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(modifyUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(modifyUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
      });
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
      });
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
      });
    builder
      .addCase(applyNewPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(applyNewPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(applyNewPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || null;
      });
    builder
      .addCase(verifyUserSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserSession.fulfilled, (state, action) => {
        state.isAuthVerified = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyUserSession.rejected, (state) => {
        state.isAuthVerified = true;
        state.user = null;
        state.isLoading = false;
      });
  }
});

export const { markAuthChecked, setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
