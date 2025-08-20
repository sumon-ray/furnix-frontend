"use client"

import { SidebarLayout } from "@/components/dashboard/sidebar-layout"
import { useListOrdersQuery, useUpdateOrderStatusMutation } from "@/store/services/endpoints"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useState } from "react"

const STATUS_OPTIONS = ["ASSIGNED", "PROCESSING", "SHIPPED", "DELIVERED"] as const
type Status = (typeof STATUS_OPTIONS)[number]

export default function DistributorOverview() {
  const { data: orders } = useListOrdersQuery({})
  const myOrders = (orders ?? []).filter(
    (o) => ["ASSIGNED", "PROCESSING", "SHIPPED"].includes(o.status),
  )
  const [update, { isLoading }] = useUpdateOrderStatusMutation()
  const [nextStatus, setNextStatus] = useState<Record<string, Status>>({})

  return (
    <SidebarLayout>
      <div className="grid gap-4">
        <h1 className="text-lg font-semibold">Assigned Orders</h1>

        {myOrders.length === 0 && (
          <div className="rounded border p-3 text-sm text-zinc-600">No assigned orders.</div>
        )}

        <div className="grid gap-2">
          {myOrders.map((o) => (
            <div
              key={o._id}
              className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] items-center gap-2 rounded-md border p-3"
            >
              {/* Order Info */}
              <div className="text-sm">
                <div className="font-medium">Order #{o._id}</div>
                <div className="text-zinc-600">
                  {o.items.length} items • ${o.total}
                </div>
              </div>

              {/* Current Status */}
              <div className="text-xs text-zinc-600">
                Current: <span className="font-medium">{o.status}</span>
              </div>

              {/* Status Dropdown + Update Button */}
              <div className="flex gap-2 items-center">
                <Select
                  value={nextStatus[o._id] || o.status}
                  onValueChange={(v) =>
                    setNextStatus((s) => ({ ...s, [o._id]: v as Status }))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="px-2 text-sm"
                  disabled={isLoading || nextStatus[o._id] === o.status}
                  onClick={async () => {
                    const status = nextStatus[o._id] || o.status
                    if (status === o.status) return // prevent double toast
                    try {
                      await update({ id: o._id, status }).unwrap()
                      // toast.success(`Order ${o._id} updated: ${status}`)
                      // Optionally refetch to update UI
                      // refetch() if needed
                    } catch {
                      toast.error("Failed to update")
                    }
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  )
}
