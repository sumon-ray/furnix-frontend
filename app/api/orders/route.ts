import { type NextRequest, NextResponse } from "next/server"
import { db, uid } from "@/lib/mock-db"
import type { Order } from "@/types"

export async function GET(req: NextRequest) {
  const store = db()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  let orders = store.orders
  if (status) orders = orders.filter((o) => o.status === status)
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const store = db()
  const body = (await req.json()) as Partial<Order>
  const _id = uid("o")
  const order: Order = {
    _id,
    userId: body.userId ?? "guest",
    customerName: body.customerName ?? "Guest",
    customerEmail: body.customerEmail ?? "guest@example.com",
    customerPhone: body.customerPhone ?? "",
    items: body.items ?? [],
    subtotal: body.subtotal ?? 0,
    discount: body.discount ?? 0,
    tax: body.tax ?? 0,
    shipping: body.shipping ?? 0,
    total: body.total ?? 0,
    address: body.address!,
    status: body.status ?? "PENDING",
    paymentMethod: body.paymentMethod ?? "COD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), 
    distributorId: undefined,
  }
  store.orders.unshift(order)
  return NextResponse.json(order)
}
