import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '@api';

export type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  feeds: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  highlightedOrder: number | null;
  currentOrder: TOrder | null;
};

export const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  feeds: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  highlightedOrder: null,
  currentOrder: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchFeeds = createAsyncThunk('order/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderModalData = null;
    },
    setOrderModalData: (state, action) => {
      state.orderModalData = action.payload;
    },
    setHighlightedOrder: (state, action) => {
      state.highlightedOrder = action.payload;
    },
    clearHighlightedOrder: (state) => {
      state.highlightedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Order
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.orderModalData = action.payload;
        state.highlightedOrder = action.payload.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      // Feeds
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      // User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      })
      // Order By Number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const {
  clearOrder,
  setOrderModalData,
  setHighlightedOrder,
  clearHighlightedOrder
} = orderSlice.actions;
export default orderSlice.reducer;
