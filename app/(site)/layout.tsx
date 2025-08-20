import type React from "react"
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-zinc-900">{children}</div>
}
