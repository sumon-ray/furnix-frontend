import { type NextRequest, NextResponse } from "next/server"
import { db, slugify, uid } from "@/lib/mock-db"
import type { Product, ProductCreateInput } from "@/types"

export async function GET(req: NextRequest) {
  const store = db()
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").toLowerCase()
  const page = Number(searchParams.get("page") ?? "1")
  const pageSize = Number(searchParams.get("pageSize") ?? "12")
  const priceMax = Number(searchParams.get("priceMax") ?? "999999")
  const material = searchParams.get("material") ?? ""
  const color = searchParams.get("color") ?? ""

  let items = store.products.filter((p) => {
    const matchesQ = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    const matchesMaterial = !material || p.variants.some((v) => v.material === material)
    const matchesColor = !color || p.variants.some((v) => v.color === color)
    const matchesPrice = p.variants.some((v) => v.price <= priceMax)
    return matchesQ && matchesMaterial && matchesColor && matchesPrice
  })
  const total = items.length
  items = items.slice((page - 1) * pageSize, page * pageSize)
  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ProductCreateInput
  const store = db()
  const _id = uid("p")
  const slug = slugify(body.slug ?? body.title)
  const prod: Product = {
    _id,
    slug,
    title: body.title,
    description: body.description,
    categoryId: body.categoryId,
    images: body.images,
    tags: body.tags ?? [],
    dimensions: body.dimensions,
    materials: body.materials,
    care: body.care,
    variants: body.variants,
    createdAt: new Date().toISOString(),
  }
  store.products.unshift(prod)
  return NextResponse.json(prod)
}
