"use client"

import { useListCategoriesQuery, useListProductsQuery } from "@/store/services/endpoints"
import { useAppSelector } from "@/hooks/use-redux"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Category } from "@/types"

export default function ProductsGrid() {
  const search = useAppSelector((s) => s.ui.search)
  const [page, setPage] = useState(1)
  const [priceMax, setPriceMax] = useState(50000)
  const [material, setMaterial] = useState("")
  const [color, setColor] = useState("")
  const [categoryId, setCategoryId] = useState("") // ✅ category select state
  const { data: categories } = useListCategoriesQuery() as { data?: Category[] }

  const filters = useMemo(
    () => ({
      priceMax: String(priceMax),
      material,
      color,
      categoryId, // ✅ include category filter
    }),
    [priceMax, material, color, categoryId]
  )

  const { data, isFetching } = useListProductsQuery({ q: search, page, pageSize: 12, filters })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-xl border p-4">
        <div className="grid gap-4">
          {/* Price Filter */}
          <div className="grid gap-2">
            <Label>Max Price</Label>
            <Slider
              value={[priceMax]}
              max={50000}
              min={50}
              step={10}
              onValueChange={(val) => setPriceMax(val[0] ?? 50000)}
            />
            <div className="text-sm text-zinc-600">Up to ${priceMax}</div>
          </div>

          {/* Material Filter */}
          <div className="grid gap-2">
            <Label>Material</Label>
            <div className="flex flex-wrap gap-2">
              {["", "Fabric", "Wood", "Metal", "Leather"].map((m) => (
                <button
                  key={m || "all"}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    m === material && "bg-zinc-900 text-white border-zinc-900"
                  )}
                  onClick={() => setMaterial(m)}
                >
                  {m || "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {["", "Gray", "Blue", "Beige", "Green", "Natural"].map((c) => (
                <button
                  key={c || "all"}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    c === color && "bg-zinc-900 text-white border-zinc-900"
                  )}
                  onClick={() => setColor(c)}
                >
                  {c || "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="grid gap-2">
            <Label>Category</Label>
            <div className="flex flex-col gap-2">
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  className={cn(
                    "rounded-md border px-3 py-1 text-sm text-left",
                    categoryId === cat._id && "bg-zinc-900 text-white border-zinc-900"
                  )}
                  onClick={() => setCategoryId(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
              <button
                className="text-sm text-zinc-600 mt-1"
                onClick={() => setCategoryId("")}
              >
                Clear Category
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <section>
        {isFetching && <div className="p-4 text-sm text-zinc-500">Loading...</div>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {(data?.items ?? []).map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`}>
              <Card className="group overflow-hidden">
                <img
                  alt={p.title}
                  className="h-40 w-full object-cover transition group-hover:scale-105"
                  src={p.images?.[0] ?? "/placeholder.svg?height=200&width=300&query=product"}
                />
                <CardContent className="grid gap-1 p-3">
                  <div className="truncate text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-zinc-500">{p.tags?.slice(0, 2).join(" • ")}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {!isFetching && (data?.items ?? []).length === 0 && (
          <div className="p-4 text-center text-zinc-500">No products found</div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <div className="text-sm text-zinc-600">Page {data?.page ?? 1}</div>
          <button
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            disabled={(data?.page ?? 1) * (data?.pageSize ?? 12) >= (data?.total ?? 0)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}
