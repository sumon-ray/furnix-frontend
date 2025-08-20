import type {
  ApiLoginRequest,
  ApiLoginResponse,
  ApiRegisterRequest,
  Category,
  CustomOrder,
  Order,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  SearchResponse,
  User,
} from "@/types";
import { api } from "./api";

export const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Auth
    login: build.mutation<ApiLoginResponse, ApiLoginRequest>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
    }),
    register: build.mutation<{ ok: boolean }, ApiRegisterRequest>({
      query: (body) => ({ url: "/api/auth/register", method: "POST", body }),
    }),
    refresh: build.query<ApiLoginResponse, void>({
      query: () => ({ url: "/api/auth/refresh" }),
    }),

    // Catalog
    listProducts: build.query<
      { items: Product[]; total: number; page: number; pageSize: number },
      {
        q?: string;
        page?: number;
        pageSize?: number;
        filters?: Record<string, string>;
      }
    >({
      query: ({ q = "", page = 1, pageSize = 20, filters = {} }) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        Object.entries(filters).forEach(([k, v]) => params.set(k, v));
        return { url: `/api/products?${params.toString()}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({
                type: "Product" as const,
                id: p._id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    getProduct: build.query<Product, { id?: string; slug?: string }>({
      query: ({ id, slug }) => ({ url: `/api/products/${id ?? slug}` }),
      providesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id ?? arg.slug ?? "unknown" },
      ],
    }),
    createProduct: build.mutation<Product, ProductCreateInput>({
      query: (body) => ({ url: "/api/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: build.mutation<
      Product,
      { id: string; data: ProductUpdateInput }
    >({
      query: ({ id, data }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: build.mutation<{ ok: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/api/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    // category
    listCategories: build.query<Category[], void>({
      query: () => ({ url: "/api/categories" }),
      providesTags: [{ type: "Category" as const, id: "LIST" }],
    }),
    search: build.query<SearchResponse, { q: string }>({
      query: ({ q }) => ({ url: `/api/search?q=${encodeURIComponent(q)}` }),
    }),

    // Orders
    createOrder: build.mutation<Order, Partial<Order>>({
      query: (body) => ({ url: "/api/orders", method: "POST", body }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    listOrders: build.query<
      Order[],
      { role?: string; status?: string; page?: number; pageSize?: number }
    >({
      query: ({ role = "", status = "", page = 1, pageSize = 20 }) => {
        const params = new URLSearchParams();
        if (role) params.set("role", role);
        if (status) params.set("status", status);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return { url: `/api/orders?${params.toString()}` };
      },
      providesTags: [{ type: "Order" as const, id: "LIST" }],
    }),

    updateOrderStatus: build.mutation<
      Order,
      { id: string; status: string; assignToDistributorId?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    // 🔥 New: Assign Order
    assignOrder: build.mutation<
      Order,
      { orderId: string; distributorId: string }
    >({
      query: ({ orderId, distributorId }) => ({
        url: `/api/orders/${orderId}/assign`,
        method: "PATCH",
        body: { distributorId },
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    // 🔥 New: Get Distributors
    getDistributors: build.query<User[], void>({
      query: () => ({ url: "/api/orders/distributors" }),
      // transformResponse: (response: { data: User[] }) => response.data,
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    // Custom Orders
    createCustomOrder: build.mutation<CustomOrder, FormData>({
      query: (body) => ({ url: "/api/custom-orders", method: "POST", body }),
      invalidatesTags: [{ type: "CustomOrder", id: "LIST" }],
    }),
    listCustomOrders: build.query<
      { items: CustomOrder[]; total: number; page: number; pageSize: number },
      { status?: string; q?: string; page?: number; pageSize?: number }
    >({
      query: ({ status, q, page = 1, pageSize = 20 } = {}) => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (q) params.set("q", q);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return { url: `/api/custom-orders?${params.toString()}` };
      },
      providesTags: (res) =>
        res?.items
          ? [
              ...res.items.map((o) => ({
                type: "CustomOrder" as const,
                id: o._id,
              })),
              { type: "CustomOrder" as const, id: "LIST" },
            ]
          : [{ type: "CustomOrder" as const, id: "LIST" }],
    }),
    getMyCustomOrders: build.query<CustomOrder[], void>({
      query: () => `/api/custom-orders/mine`,
      providesTags: [{ type: "CustomOrder", id: "MINE" }],
    }),
    updateCustomOrderStatus: build.mutation<
      CustomOrder,
      { id: string; status: string; adminNotes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/custom-orders/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (res) =>
        res?._id
          ? [
              { type: "CustomOrder", id: res._id },
              { type: "CustomOrder", id: "LIST" },
            ]
          : [{ type: "CustomOrder", id: "LIST" }],
    }),
    deleteCustomOrder: build.mutation<{ ok: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/api/custom-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CustomOrder", id: "LIST" }],
    }),

    // Users
    listUsers: build.query<User[], void>({
      query: () => ({ url: "/api/users" }),
      providesTags: [{ type: "User" as const, id: "LIST" }],
    }),
  }),
});

export const {
  // auth
  useLoginMutation,
  useRegisterMutation,
  useRefreshQuery,
  // categories
  useListCategoriesQuery,
  // products
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchQuery,
  // orders
  useCreateOrderMutation,
  useListOrdersQuery,
  useUpdateOrderStatusMutation,
  useAssignOrderMutation,
  useGetDistributorsQuery,
  // custom orders
  useCreateCustomOrderMutation,
  useListCustomOrdersQuery,
  useGetMyCustomOrdersQuery,
  useUpdateCustomOrderStatusMutation,
  useDeleteCustomOrderMutation,
  // users
  useListUsersQuery,
} = extendedApi;
