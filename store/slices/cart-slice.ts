import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem, CartState } from "@/types"
import { logout, setCredentials } from "./auth-slice"
// import { logout, setCredentials } from "./auth.slice"  // auth এর action import করো

const initialState: CartState = {
  items: [],
  b2bDiscountPct: 0,
}

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const idx = state.items.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantKey === action.payload.variantKey,
      )
      if (idx >= 0) {
        state.items[idx].qty += action.payload.qty
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; variantKey: string }>,
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.variantKey === action.payload.variantKey
          ),
      )
    },
    updateQty: (
      state,
      action: PayloadAction<{ productId: string; variantKey: string; qty: number }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantKey === action.payload.variantKey,
      )
      if (item) item.qty = Math.max(1, action.payload.qty)
    },
    clearCart: (state) => {
      state.items = []
    },
    setB2BDiscount: (state, action: PayloadAction<number>) => {
      state.b2bDiscountPct = action.payload
    },
  },

  // 👇 Extra Reducers - auth এর সাথে sync করার জন্য
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = []
        state.b2bDiscountPct = 0
      })
      .addCase(setCredentials, (state) => {
        // new user login করলে cart clear হবে
        state.items = []
        state.b2bDiscountPct = 0
      })
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart, setB2BDiscount } =
  slice.actions
export default slice.reducer
