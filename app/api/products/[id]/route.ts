import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import type { ProductUpdateInput } from "@/types"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  const item = store.products.find((p) => p._id === params.id || p.slug === params.id)
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  const idx = store.products.findIndex((p) => p._id === params.id)
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = (await req.json()) as ProductUpdateInput
  store.products[idx] = { ...store.products[idx], ...body }
  return NextResponse.json(store.products[idx])
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  store.products = store.products.filter((p) => p._id !== params.id)
  return NextResponse.json({ ok: true })
}
