"use client"

import { SiteHeader } from "@/components/site-header"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLoginMutation } from "@/store/services/endpoints"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/auth-slice"
import { toast } from "react-toastify"
import Link from "next/link"

type FormValues = { email: string; password: string }

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: "user@gmail.com", password: "123456" },
  })
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()

  const onSubmit = async (vals: FormValues) => {
    try {
      const res = await login(vals).unwrap()
      dispatch(setCredentials(res))
      toast.success("Welcome back")
      window.location.href = "/"
    } catch (e) {
      toast.error("Invalid credentials")
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md p-3 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded-md border p-4">
          <div>
            <Label>Email</Label>
            <Input {...register("email", { required: true })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password", { required: true })} />
          </div>
          <Button disabled={isLoading} type="submit">
            Login
          </Button>
          <div className="text-sm text-zinc-600">
            No account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </form>
      </main>
    </>
  )
}
