"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/use-redux";
import { useCreateOrderMutation } from "@/store/services/endpoints";
import { clearCart } from "@/store/slices/cart-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const cart = useAppSelector((s) => s.cart);
  const user = useAppSelector((s) => s.auth.user);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"SSLCommerz" | "COD">(
    "COD"
  );
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const [orderPlaced, setOrderPlaced] = useState(false); // ✅ single toast flag

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = 0;
  const tax = Math.round(subtotal * 0.07);
  const shipping = subtotal > 1000 ? 0 : 25;
  const total = subtotal - discount + tax + shipping;

  async function placeOrder() {
    if (orderPlaced) return; // prevent double toast

    if (!address.phone) {
      setPhoneError("Phone number is required");
      return;
    }

    if (phoneError) {
      toast.error("Please fix phone number error before placing order");
      return;
    }

    try {
      const order = await createOrder({
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        items: cart.items.map((i) => ({
          productId: i.productId,
          title: i.title,
          variantKey: i.variantKey,
          price: i.price,
          qty: i.qty,
        })),
        subtotal,
        discount,
        tax,
        shipping,
        total,
        paymentMethod,
        address,
        status: "PENDING",
      }).unwrap();

      setOrderPlaced(true); // ✅ mark as placed
      dispatch(clearCart());

      // Only show toast if not using SSLCommerz redirect
      if (paymentMethod === "COD") {
        toast.success("Order placed!");
        window.location.href = "/";
        return;
      }

      // SSLCommerz redirect
      if (process.env.NEXT_PUBLIC_API_BASE_URL && paymentMethod === "SSLCommerz") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/sslcommerz/init`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order._id,
              amount: order.total,
              currency: "BDT",
            }),
          }
        );
        if (!res.ok) throw new Error("Payment init failed");
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      }
    } catch (e: any) {
      if (e?.status === 401) toast.error("Please login first");
      else toast.error("Failed to place order");
      console.error("Order error:", e);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl p-3 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold">Checkout</h1>

        {/* Steps */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className={step === 1 ? "font-semibold" : "text-zinc-500"}>
            1. Shipping
          </span>
          <span className="text-zinc-300">{">"}</span>
          <span className={step === 2 ? "font-semibold" : "text-zinc-500"}>
            2. Payment
          </span>
          <span className="text-zinc-300">{">"}</span>
          <span className={step === 3 ? "font-semibold" : "text-zinc-500"}>
            3. Review
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid gap-3 rounded-md border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>Full name</Label>
                <Input
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={address.email}
                  onChange={(e) =>
                    setAddress({ ...address, email: e.target.value })
                  }
                  disabled={!!user?.email}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={address.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9+]*$/.test(val)) {
                      setAddress({ ...address, phone: val });
                      setPhoneError("");
                    } else {
                      setPhoneError(
                        "Phone number must contain only digits or '+'"
                      );
                    }
                  }}
                />
                {phoneError && (
                  <div className="text-red-500 text-sm">{phoneError}</div>
                )}
              </div>
            </div>

            <div>
              <Label>Street</Label>
              <Input
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>City</Label>
                <Input
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>Postal code</Label>
                <Input
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid gap-3 rounded-md border p-4">
            <Label>Payment method</Label>
            <div className="flex gap-2">
              {(["SSLCommerz", "COD"] as const).map((pm) => (
                <button
                  key={pm}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    paymentMethod === pm
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod(pm)}
                >
                  {pm}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Review</Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="grid gap-3 rounded-md border p-4">
            <div className="text-sm">
              <div className="font-medium">Shipping to:</div>
              <div className="text-zinc-600">
                {address.fullName}, {address.street}, {address.city},{" "}
                {address.state} {address.postalCode}, {address.country} •{" "}
                {address.phone}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Payment:</div>
              <div className="text-zinc-600">{paymentMethod}</div>
            </div>

            <div className="grid gap-1 text-sm mt-2">
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

            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button disabled={isLoading} onClick={placeOrder}>
                Place order
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
