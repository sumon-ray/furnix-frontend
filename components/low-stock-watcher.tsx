"use client"

import { useEffect } from "react"
import { toast } from "react-toastify"

export function LowStockWatcher() {
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/products").then((r) => r.json())
        const low = (res.items as any[]).flatMap((p) =>
          (p.variants ?? []).filter((v: any) => v.stock > 0 && v.stock <= 3).map((v: any) => ({ title: p.title, v })),
        )
        if (low.length) {
          low.slice(0, 1).forEach((l) => {
            toast.warn(`Low stock: ${l.title} (${l.v.size} • ${l.v.color}) — ${l.v.stock} left`)
          })
        }
      } catch {}
    }, 15000)
    return () => clearInterval(id)
  }, [])
  return null
}
