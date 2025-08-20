import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from ".."

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
/**
 * Note: Only variables prefixed with NEXT_PUBLIC_ are exposed to the client bundle in Next.js.
 * This allows toggling between the mock in-app API ("") and the external Express API via env. [^2]
 */

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.auth.accessToken
      // console.log("Token in store:", token)
      if (token) headers.set("Authorization", `Bearer ${token}`)
      return headers
    },
    credentials: "include", // optional, cookie use করলে
  }),
  tagTypes: ["Product", "Category", "Order", "User", "CustomOrder"],
  endpoints: () => ({}),
})
