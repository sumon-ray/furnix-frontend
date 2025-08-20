import type { Category, CustomOrder, Order, Product, ProductVariant, User } from "@/types"

type DB = {
  users: User[]
  passwords: Record<string, string>
  categories: Category[]
  products: Product[]
  orders: Order[]
  customOrders: CustomOrder[]
  refreshTokens: Record<string, string> // userId -> token
}

declare global {
  // eslint-disable-next-line no-var
  var __MOCK_DB__: DB | undefined
}

function init(): DB {
  if (!globalThis.__MOCK_DB__) {
    const now = new Date().toISOString()
    const users: User[] = [
      { id: "u1", name: "Super Admin", email: "super@furnix.dev", role: "SUPER_ADMIN", verified: true },
      { id: "u2", name: "Admin Amy", email: "admin@furnix.dev", role: "ADMIN", verified: true },
      { id: "u3", name: "Dan Distributor", email: "dist@furnix.dev", role: "DISTRIBUTOR", verified: true },
      { id: "u4", name: "Cathy Customer", email: "cathy@furnix.dev", role: "CUSTOMER", verified: true },
    ]
    const passwords: Record<string, string> = {
      "super@furnix.dev": hash("password"),
      "admin@furnix.dev": hash("password"),
      "dist@furnix.dev": hash("password"),
      "cathy@furnix.dev": hash("password"),
    }
    const categories: Category[] = [
      { id: "c1", name: "Living Room", slug: "living-room", level: 0 },
      { id: "c2", name: "Sofas", slug: "sofas", level: 1, parentId: "c1" },
      { id: "c3", name: "Sectional Sofas", slug: "sectional-sofas", level: 2, parentId: "c2" },
      { id: "c4", name: "Chairs", slug: "chairs", level: 1, parentId: "c1" },
      { id: "c5", name: "Bedroom", slug: "bedroom", level: 0 },
      { id: "c6", name: "Beds", slug: "beds", level: 1, parentId: "c5" },
      { id: "c7", name: "Tables", slug: "tables", level: 1, parentId: "c1" },
    ]

    const pv = (
      sku: string,
      size: string,
      color: string,
      material: string,
      price: number,
      stock: number,
    ): ProductVariant => ({
      sku,
      size,
      color,
      material,
      price,
      b2bPrice: Math.round(price * 0.9),
      stock,
    })

    const products: Product[] = [
      {
        id: "p1",
        slug: "aurora-sectional-sofa",
        title: "Aurora Sectional Sofa",
        description: "A modern sectional sofa with plush cushions and durable upholstery. Perfect for living rooms.",
        categoryId: "c3",
        images: ["/placeholder.svg?height=600&width=900", "/placeholder.svg?height=600&width=900"],
        tags: ["sofa", "sectional", "living-room", "modern"],
        dimensions: "320 x 180 x 85 cm",
        materials: "Solid wood frame, high-density foam, polyester fabric",
        care: "Vacuum regularly. Spot clean with mild detergent.",
        variants: [
          pv("AUR-SEC-1", "L", "Gray", "Fabric", 1200, 8),
          pv("AUR-SEC-2", "L", "Blue", "Fabric", 1200, 4),
          pv("AUR-SEC-3", "XL", "Gray", "Fabric", 1500, 2),
        ],
        createdAt: now,
      },
      {
        id: "p2",
        slug: "oakridge-dining-table",
        title: "Oakridge Dining Table",
        description: "Solid oak dining table with a natural finish and clean lines.",
        categoryId: "c7",
        images: ["/placeholder.svg?height=600&width=900", "/placeholder.svg?height=600&width=900"],
        tags: ["table", "dining", "oak"],
        dimensions: "200 x 100 x 75 cm",
        materials: "Solid oak wood, natural oil finish",
        care: "Wipe with a soft damp cloth.",
        variants: [pv("OAK-TBL-1", "200cm", "Natural", "Wood", 850, 12)],
        createdAt: now,
      },
      {
        id: "p3",
        slug: "cloud-lounge-chair",
        title: "Cloud Lounge Chair",
        description: "Ergonomic lounge chair with memory foam padding and steel legs.",
        categoryId: "c4",
        images: ["/placeholder.svg?height=600&width=900"],
        tags: ["chair", "lounge", "comfort"],
        dimensions: "90 x 85 x 95 cm",
        materials: "Steel legs, memory foam, microfiber",
        care: "Spot clean with fabric cleaner.",
        variants: [
          pv("CLD-CHR-1", "Std", "Beige", "Fabric", 320, 25),
          pv("CLD-CHR-2", "Std", "Green", "Fabric", 320, 0),
        ],
        createdAt: now,
      },
    ]

    globalThis.__MOCK_DB__ = {
      users,
      passwords,
      categories,
      products,
      orders: [],
      customOrders: [],
      refreshTokens: {},
    }
  }
  return globalThis.__MOCK_DB__!
}

export function db() {
  return init()
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function hash(s: string) {
  // demo only, replace with bcrypt in real backend
  return btoa(s.split("").reverse().join(""))
}

export function verifyHash(s: string, h: string) {
  return hash(s) === h
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
