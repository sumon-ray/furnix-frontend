import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").toLowerCase()
  const store = db()
  const products = store.products.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  )
  return NextResponse.json({ products, total: products.length })
}
