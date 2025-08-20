"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { useCreateCustomOrderMutation } from "@/store/services/endpoints"
import { SiteHeader } from "@/components/site-header"
import { useAppSelector } from "@/hooks/use-redux"

type FormValues = {
  name: string
  email: string
  phone: string
  roomMeasurements?: string
  details: string
  files?: FileList
}

export default function CustomOrderPage() {
  const user = useAppSelector((s) => s.auth.user)
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      email: user?.email || "",
    },
  })

  // যদি user change হয় (login), email auto-set কর
  useEffect(() => {
    if (user?.email) setValue("email", user.email)
  }, [user?.email, setValue])

  const [previews, setPreviews] = useState<string[]>([])
  const [createCustomOrder, { isLoading }] = useCreateCustomOrderMutation()

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData()
    fd.append("name", values.name)
    fd.append("email", user?.email || "") // always logged-in email
    fd.append("phone", values.phone)
    fd.append("details", values.details)
    if (values.roomMeasurements) fd.append("roomMeasurements", values.roomMeasurements)
    Array.from(values.files || []).forEach((f) => fd.append("files", f))

    try {
      await createCustomOrder(fd).unwrap()
      toast.success("Custom order submitted")
      reset()
      setPreviews([])
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit")
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl p-3 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold">Custom Furniture Request</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-md border p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input {...register("name", { required: true })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input {...register("phone", { required: true })} />
            </div>
            <div>
              <Label>Room measurements</Label>
              <Input placeholder="e.g., 350 x 420 cm" {...register("roomMeasurements")} />
            </div>
          </div>

          <div>
            <Label>Details</Label>
            <Textarea rows={5} {...register("details", { required: true })} />
          </div>

          <div>
            <Label>Upload reference images or PDFs</Label>
            <Input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => {
                const files = e.target.files
                if (files) setValue("files", files)

                const previews = Array.from(files || [])
                  .filter((f) => f.type.startsWith("image/"))
                  .map((f) => URL.createObjectURL(f))

                setPreviews(previews)
              }}
            />
            {!!previews.length && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i}`}
                    className="h-24 w-24 rounded object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <Button disabled={isLoading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
