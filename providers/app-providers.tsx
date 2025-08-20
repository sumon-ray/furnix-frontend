"use client"

import type React from "react"
import { SocketEvents } from "@/components/socket-events"

import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { store, persistor } from "@/store"
import { type ReactNode, useEffect, useState } from "react"
// import { LowStockWatcher } from "@/components/low-stock-watcher"

function PersistGateLite({ children, loading }: { children: ReactNode; loading?: React.ReactNode }) {
  const [bootstrapped, setBootstrapped] = useState(false)
  useEffect(() => {
    // if already bootstrapped, show immediately
    if (persistor.getState().bootstrapped) {
      setBootstrapped(true)
      return
    }
    const unsubscribe = persistor.subscribe(() => {
      const state = persistor.getState()
      if (state.bootstrapped) {
        setBootstrapped(true)
        unsubscribe?.()
      }
    })
    return () => {
      unsubscribe?.()
    }
  }, [])
  return <>{bootstrapped ? children : (loading ?? null)}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--toastify-color-success", "hsl(142 71% 45%)")
    document.documentElement.style.setProperty("--toastify-color-warning", "hsl(38 92% 50%)")
    document.documentElement.style.setProperty("--toastify-color-error", "hsl(0 84% 60%)")
  }, [])
  return (
    <Provider store={store}>
      <PersistGateLite loading={<div className="p-6 text-sm">Loading...</div>}>
        {/* <LowStockWatcher /> */}
        <SocketEvents />
        {children}
        <ToastContainer position="top-right" />
      </PersistGateLite>
    </Provider>
  )
}
