"use client"

import { SidebarLayout } from "@/components/dashboard/sidebar-layout"
import { useCreateProductMutation, useDeleteProductMutation, useListProductsQuery } from "@/store/services/endpoints"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"

type FormValues = {
  title: string
  description: string
  price: number
  image: FileList
}

export default function AdminProductsPage() {
  const { data } = useListProductsQuery({ q: "", page: 1, pageSize: 50, filters: {} })
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const onCreate = async (vals: FormValues) => {
    const img = vals.image?.[0]
      ? await new Promise<string>((res) => {
          const fr = new FileReader()
          fr.onload = () => res(fr.result as string)
          fr.readAsDataURL(vals.image[0])
        })
      : "/placeholder.svg?height=600&width=900"
    try {
      await createProduct({
        title: vals.title,
        description: vals.description,
        // categoryId: vals.categoryId,
        images: [img],
        tags: [],
        variants: [
          {
            sku: "NEW-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
            size: "Std",
            color: "Natural",
            material: "Wood",
            price: Number(vals.price || 100),
            b2bPrice: Number(vals.price || 100) * 0.9,
            stock: 10,
          },
        ],
      } as any).unwrap()
      toast.success("Product created")
      reset()
    } catch {
      toast.error("Failed to create")
    }
  }

  return (
    <SidebarLayout>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit(onCreate)} className="grid gap-3 rounded-lg border p-4">
          <div className="text-lg font-semibold">Add Product</div>
          <div>
            <Label>Title</Label>
            <Input {...register("title", { required: true })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={4} {...register("description", { required: true })} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" step="1" {...register("price", { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" {...register("image")} />
          </div>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </form>
        <div className="grid gap-3">
          <div className="text-lg font-semibold">Products</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data?.items.map((p) => (
              <div key={p.id} className="rounded-md border">
                <img alt={p.title} src={p.images[0] ?? ""} className="h-32 w-full rounded-t object-cover" />
                <div className="p-2">
                  <div className="truncate text-sm font-medium">{p.title}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <a className="text-xs underline" href={`/products/${p.slug}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                    <button
                      className="text-xs text-red-600 underline"
                      onClick={async () => {
                        await deleteProduct({ id: p.id })
                        toast.success("Deleted")
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
