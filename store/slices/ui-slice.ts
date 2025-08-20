import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "ui",
  initialState: {
    search: "",
  } as { search: string },
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
  },
})

export const { setSearch } = slice.actions
export default slice.reducer
