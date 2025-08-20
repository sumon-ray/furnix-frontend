"use client"

import { SiteHeader } from "@/components/site-header"
import { useAppSelector } from "@/hooks/use-redux"
import Link from "next/link"

export default function AccountPage() {
  const user = useAppSelector((s) => s.auth.user)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl p-3 sm:p-6">
        <h1 className="mb-2 text-xl font-semibold">Account</h1>
        {!user ? (
          <div className="rounded border p-4 text-sm">
            You are not logged in.{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </div>
        ) : (
          <div className="grid gap-2 rounded border p-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {user.role}
            </div>
            <div className="mt-2">
              {user.role === "DISTRIBUTOR" ? (
                <Link className="underline" href="/distributor">
                  Distributor Dashboard
                </Link>
              ) : user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                <Link className="underline" href="/admin">
                  Admin Dashboard
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
