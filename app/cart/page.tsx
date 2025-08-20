"use client"

import { SiteHeader } from "@/components/site-header"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { removeFromCart, updateQty } from "@/store/slices/cart-slice"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const cart = useAppSelector((s) => s.cart)
  const isB2B = useAppSelector((s) => s.auth.user?.role === "DISTRIBUTOR" || s.auth.user?.role === "ADMIN")
  const dispatch = useAppDispatch()

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = isB2B ? Math.round(subtotal * 0.1) : 0
  const tax = Math.round((subtotal - discount) * 0.07)
  const shipping = subtotal > 1000 ? 0 : 25
  const total = subtotal - discount + tax + shipping

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl p-3 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold">Your Cart</h1>
        {cart.items.length === 0 ? (
          <div className="rounded-md border p-6 text-sm">
            Cart is empty.{" "}
            <Link href="/" className="underline">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="grid gap-3">
              {cart.items.map((item) => (
                <div key={item.productId + item.variantKey} className="flex gap-3 rounded-md border p-3">
                  <img
                    alt={item.title}
                    src={item.image || "/placeholder.svg?height=120&width=160&query=cart"}
                    className="h-24 w-32 rounded object-cover"
                  />
                  <div className="grid flex-1 gap-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-zinc-600">{item.variantKey.replaceAll("|", " • ")}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="rounded border px-2 text-sm"
                        onClick={() =>
                          dispatch(
                            updateQty({
                              productId: item.productId,
                              variantKey: item.variantKey,
                              qty: Math.max(1, item.qty - 1),
                            }),
                          )
                        }
                      >
                        -
                      </button>
                      <div className="w-8 text-center text-sm">{item.qty}</div>
                      <button
                        className="rounded border px-2 text-sm"
                        onClick={() =>
                          dispatch(
                            updateQty({
                              productId: item.productId,
                              variantKey: item.variantKey,
                              qty: Math.min(item.stock, item.qty + 1),
                            }),
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="ml-3 text-xs text-red-600 underline"
                        onClick={() =>
                          dispatch(removeFromCart({ productId: item.productId, variantKey: item.variantKey }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-nowrap text-right font-medium">${item.price * item.qty}</div>
                </div>
              ))}
            </div>
            <div className="h-fit rounded-md border p-4">
              <div className="mb-3 text-lg font-semibold">Summary</div>
              <div className="grid gap-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping}</span>
                </div>
                <div className="my-2 border-t" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="mt-3 w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
