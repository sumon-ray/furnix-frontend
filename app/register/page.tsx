"use client"

import { SiteHeader } from "@/components/site-header"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRegisterMutation } from "@/store/services/endpoints"
import { toast } from "react-toastify"
import Link from "next/link"

type FormValues = { name: string; email: string; password: string }

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormValues>()
  const [mutate, { isLoading }] = useRegisterMutation()

  const onSubmit = async (vals: FormValues) => {
    try {
      await mutate(vals).unwrap()
      toast.success("Registered. Please login.")
      window.location.href = "/login"
    } catch {
      toast.error("Failed to register")
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md p-3 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded-md border p-4">
          <div>
            <Label>Name</Label>
            <Input {...register("name", { required: true })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email", { required: true })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password", { required: true })} />
          </div>
          <Button disabled={isLoading} type="submit">
            Create account
          </Button>
          <div className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form>
      </main>
    </>
  )
}
