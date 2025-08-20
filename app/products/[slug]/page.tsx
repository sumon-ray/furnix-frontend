"use client"

import { useParams } from "next/navigation"
import { useGetProductQuery, useListProductsQuery } from "@/store/services/endpoints"
import { SiteHeader } from "@/components/site-header"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { addToCart } from "@/store/slices/cart-slice"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { RootState } from "@/store" // RootState import

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  if (!params?.slug) {
    return <div>Invalid product URL</div>
  }

  const { data: product } = useGetProductQuery({ slug: params.slug })
  const { data: related } = useListProductsQuery({ q: "", page: 1, pageSize: 8, filters: {} })
  const [variantIdx, setVariantIdx] = useState(0)
  const v = useMemo(() => product?.variants?.[variantIdx], [product, variantIdx])
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user) // ✅ login user

  if (!product) {
    return (
      <>
        <SiteHeader />
        <div className="mx-auto max-w-6xl p-6">Loading...</div>
      </>
    )
  }

  const fbt = (related?.items ?? [])
    .filter((p) => p.categoryId === product.categoryId && p._id !== product._id)
    .slice(0, 4)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-3">
            <img
              alt={product.title}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={product.images[0] ?? "/placeholder.svg?height=600&width=900&query=product"}
            />
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img || "/placeholder.svg"}
                  alt={"Thumbnail " + idx}
                  className="h-20 w-28 cursor-pointer rounded-md border object-cover"
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <div className="text-sm text-zinc-600">{product.description}</div>

            {v && (
              <div className="text-xl font-bold">
                ${v.price}{" "}
                <span className="text-sm font-normal text-zinc-500">({v.stock} in stock)</span>
              </div>
            )}

            <div className="grid gap-2">
              <div className="text-sm font-medium">Variants</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((vv, idx) => (
                  <button
                    onClick={() => setVariantIdx(idx)}
                    key={vv.sku}
                    className={
                      "rounded-md border px-3 py-1 text-sm " +
                      (idx === variantIdx ? "border-zinc-900 bg-zinc-900 text-white" : "")
                    }
                  >
                    {vv.size} • {vv.color} • {vv.material}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1 text-sm">
              {product.dimensions && (
                <div>
                  <span className="font-medium">Dimensions: </span>
                  {product.dimensions}
                </div>
              )}
              {product.materials && (
                <div>
                  <span className="font-medium">Materials: </span>
                  {product.materials}
                </div>
              )}
              {product.care && (
                <div>
                  <span className="font-medium">Care: </span>
                  {product.care}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                disabled={!v || v.stock <= 0}
                onClick={() => {
                  if (!user) {
                    toast.error("Please login first") // ✅ login check
                    return
                  }
                  if (!v) return
                  dispatch(
                    addToCart({
                      productId: product._id,
                      title: product.title,
                      image: product.images[0] ?? "",
                      variantKey: `${v.size}|${v.color}|${v.material}`,
                      price: v.price,
                      qty: 1,
                      stock: v.stock,
                    }),
                  )
                  toast.success("Added to cart")
                }}
              >
                Add to cart
              </Button>
              <Button   onClick={() => {
    toast.info("This feature is coming soon! Wishlist functionality will be available shortly.")
  }} className="" variant="outline">Add to wishlist</Button>
            </div>

            <div className="mt-6 grid gap-2">
              <div className="text-sm font-medium">Frequently Bought Together</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {fbt.map((rp) => (
                  <a key={rp._id} href={`/products/${rp.slug}`} className="rounded-md border p-2">
                    <img
                      alt={rp.title}
                      src={rp.images[0] ?? "/placeholder.svg?height=200&width=300&query=related"}
                      className="h-24 w-full rounded object-cover"
                    />
                    <div className="mt-2 truncate text-xs text-zinc-700">{rp.title}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
