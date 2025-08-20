"use client"

import { SidebarLayout } from "@/components/dashboard/sidebar-layout"
import { useListUsersQuery } from "@/store/services/endpoints"

export default function AdminUsersPage() {
  const { data } = useListUsersQuery()
  return (
    <SidebarLayout>
      <div className="grid gap-3">
        <div className="text-lg font-semibold">Users</div>
        <div className="grid gap-2">
          {(data ?? []).map((u) => (
            <div key={u.id} className="grid grid-cols-2 rounded border p-2 text-sm sm:grid-cols-4">
              <div className="font-medium">{u.name}</div>
              <div className="truncate">{u.email}</div>
              <div className="uppercase text-zinc-600">{u.role}</div>
              <div className="text-zinc-600">{u.verified ? "Verified" : "Unverified"}</div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  )
}
