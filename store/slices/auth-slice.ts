import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, User } from "@/types"

const initialState: AuthState = {
  user: null,
  accessToken: "",
  refreshToken: "",
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    logout: (state) => {
      state.user = null
      state.accessToken = ""
      state.refreshToken = ""
    },
  },
})

export const { setCredentials, logout } = slice.actions
export default slice.reducer
