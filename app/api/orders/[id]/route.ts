import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  const idx = store.orders.findIndex((o) => o._id === params.id)
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  store.orders[idx] = { ...store.orders[idx], ...body }
  return NextResponse.json(store.orders[idx])
}
