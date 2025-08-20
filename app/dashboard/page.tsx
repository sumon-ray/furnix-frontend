"use client"

import { SidebarLayout } from "@/components/dashboard/sidebar-layout"
import { useListOrdersQuery } from "@/store/services/endpoints"

export default function AdminOverviewPage() {
  const { data: orders } = useListOrdersQuery({})

  const sales = (orders ?? []).reduce((n, o) => n + (o.status !== "CANCELLED" ? o.total : 0), 0)
  const pending = (orders ?? []).filter((o) => o.status === "PENDING").length
  const lowStock = 3

  return (
    <SidebarLayout>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Monthly Sales</div>
          <div className="text-2xl font-semibold">${sales}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Pending Orders</div>
          <div className="text-2xl font-semibold">{pending}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Low Stock Warnings</div>
          <div className="text-2xl font-semibold">{lowStock}</div>
        </div>
      </div>
    </SidebarLayout>
  )
}
