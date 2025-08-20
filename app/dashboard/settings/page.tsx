"use client"

import { SidebarLayout } from "@/components/dashboard/sidebar-layout"

export default function AdminSettingsPage() {
  return (
    <SidebarLayout>
      <div className="rounded border p-4 text-sm text-zinc-600">
        Connect your email (Nodemailer), SMS (Twilio), payment (SSLCommerz) and sockets here in a real backend.
      </div>
    </SidebarLayout>
  )
}
