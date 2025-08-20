"use client"

import { useListCustomOrdersQuery, useUpdateCustomOrderStatusMutation } from "@/store/services/endpoints"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { useCustomOrderSocket } from "@/hooks/useCustomOrderSocket"
import { useAppSelector } from "@/hooks/use-redux"
import { useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/dashboard/sidebar-layout"

const STATUSES = ["SUBMITTED", "APPROVED", "IN_PROGRESS", "REJECTED", "COMPLETED"] as const
type Status = (typeof STATUSES)[number]

// Flexible Role type
type Role = string | undefined

export default function CustomOrdersPage() {
  const role: Role = useAppSelector((s) => s.auth.user?.role)
  const userId: string | undefined = useAppSelector((s) => s.auth.user?._id)
  const router = useRouter()

  // Unauthorized হলে redirect
  useEffect(() => {
    if (!role || !["ADMIN", "SUPER_ADMIN", "CUSTOMER"].includes(role)) {
      router.replace("/") 
    }
  }, [role, router])

  // API call: role অনুযায়ী endpoint select
  const queryParams =
    role === "CUSTOMER"
      ? { mine: true, userId: userId ?? "" } // Customer শুধু তার নিজের orders
      : { page: 1, pageSize: 100 } // Admin সব orders

  const { data, isLoading, refetch } = useListCustomOrdersQuery(queryParams, { skip: !role })
  const [updateStatus, { isLoading: changing }] = useUpdateCustomOrderStatusMutation()
  const [next, setNext] = useState<Record<string, Status>>({})

  useCustomOrderSocket(() => refetch())

  if (!role) return null // type safety
  if (isLoading) return <div className="p-4">Loading...</div>

  return (
  <SidebarLayout>
      <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Custom Orders</h1>

      <div className="rounded-lg border divide-y">
        {data?.items?.map((o) => (
          <div key={o._id} className="p-3 grid gap-2 sm:grid-cols-[1fr_auto] items-center">
            <div>
              <div className="font-medium">{o.name} — {o.email} — {o.phone}</div>
              <div className="text-sm text-muted-foreground">
                Status: {o.status} • {new Date(o.createdAt).toLocaleString()}
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                {(o.attachments || []).map((a: string, i: number) =>
                  a.endsWith(".pdf") ? (
                    <Button key={i} asChild variant="default" size="sm">
                      <a href={`https://furnix-backend-gsgs.onrender.com${a}`} target="_blank">
                        PDF #{i + 1}
                      </a>
                    </Button>
                  ) : (
                    <a key={i} href={a} target="_blank">
                      <img src={a} className="h-16 w-16 rounded object-cover border" />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* শুধু ADMIN / SUPER_ADMIN কে status change করতে দাও */}
            {["ADMIN", "SUPER_ADMIN"].includes(role) && (
              <div className="flex items-center gap-2 justify-end">
                <Select value={next[o._id] || o.status} onValueChange={(v) => setNext((s) => ({ ...s, [o._id]: v as Status }))}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button
                  disabled={changing}
                  onClick={async () => {
                    const status = next[o._id] || o.status
                    try {
                      await updateStatus({ id: o._id, status }).unwrap()
                      toast.success("Status updated")
                      refetch()
                    } catch (e) {
                      toast.error("Failed to update")
                    }
                  }}
                >
                  Update
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </SidebarLayout>
  )
}
