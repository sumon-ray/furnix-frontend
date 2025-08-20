export type Role = "SUPER_ADMIN" | "ADMIN" | "DISTRIBUTOR" | "CUSTOMER"

export type User = {
  _id: string
  name: string
  email: string
  role: Role
  verified: boolean
}

export type AuthState = {
  user: User | null
  accessToken: string
  refreshToken: string
}

export type Category = {
  _id: string
  name: string
  slug: string
  parentId?: string | null
  level: number
}

// export interface Order {
//   id: string
//   title: string
//   distributorId?: string
//   status: string
// }
export type ProductVariant = {
  sku: string
  size: string
  color: string
  material: string
  price: number
  b2bPrice?: number
  stock: number
}

export type Product = {
  _id: string
  slug: string
  title: string
  description: string
  categoryId: string
  images: string[]
  tags: string[]
  dimensions?: string
  materials?: string
  care?: string
  variants: ProductVariant[]
  createdAt: string
}

export type ProductCreateInput = Omit<Product, "id" | "createdAt" | "slug"> & { slug?: string }
export type ProductUpdateInput = Partial<Omit<Product, "id" | "createdAt">>

export type CartItem = {
  productId: string
  title: string
  image: string
  variantKey: string // derived: size|color|material
  price: number
  qty: number
  stock: number
}

export type CartState = {
  items: CartItem[]
  b2bDiscountPct: number
}

export type OrderItem = {
  productId: string
  title: string
  variantKey: string
  price: number
  qty: number
}

export type Address = {
  id?: string
  fullName: string
  email:string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type Order = {
  customerName:string
  customerEmail:string
  customerPhone:string
  _id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  address: Address
  status: "PENDING" | "PAID" | "PROCESSING" | "ASSIGNED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  distributorId?: string
  paymentMethod: "SSLCommerz" | "COD"
  createdAt: string  // <-- date string
  updatedAt: string  // <-- date string
}

export type CustomOrder = {
  _id: string
  userId?: string
  customerName: string
  name: string
  email: string
  phone: string
  details: string
  roomMeasurements?: string
  attachments: string[] // base64 or URLs
  status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED"
  createdAt: string
}

export type ApiLoginRequest = { email: string; password: string }
export type ApiRegisterRequest = { name: string; email: string; password: string; role?: Role }

export type ApiLoginResponse = {
  user: User
  accessToken: string
  refreshToken: string
}


export type SearchResponse = {
  products: Product[]
  total: number
}
