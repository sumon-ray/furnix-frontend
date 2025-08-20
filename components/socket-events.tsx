"use client"

import { useEffect } from "react"
import { toast } from "react-toastify"

export function SocketEvents() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const origin = (() => {
    try {
      const u = new URL(base, typeof window !== "undefined" ? window.location.href : "http://localhost")
      return `${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`
    } catch {
      return ""
    }
  })()

  useEffect(() => {
    let cleanup: (() => void) | undefined
    if (origin) {
      ;(async () => {
        const { io } = await import("socket.io-client")
        const socket = io(origin, {
          withCredentials: true,
          transports: ["websocket"],
        })
        socket.on("connect", () => {
          // Optional: toast.info("Realtime connected")
        })
        socket.on("order:update", (p: any) => {
          toast.info(`Order ${p.id} updated: ${p.status}`)
        })
        socket.on("stock:low", (p: any) => {
          toast.warn(`Low stock: ${p.title} (${p.variant?.size} • ${p.variant?.color}) — ${p.variant?.stock} left`)
        })
        cleanup = () => {
          socket.disconnect()
        }
      })()
    }
    return () => {
      cleanup?.()
    }
  }, [origin])

  if (!origin) return null

  return null
}
