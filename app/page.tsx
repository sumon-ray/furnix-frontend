import ProductsGrid from "@/components/products-grid";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-3 sm:px-6">
        <section className="grid gap-8 py-6">
          <div className="rounded-2xl border bg-zinc-50/50 p-6 lg:p-10">
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div className="grid gap-4">
                <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Designer furniture for every space, retail to bulk.
                </h1>
                <p className="text-zinc-600">
                  Discover curated collections and corporate pricing with easy
                  bulk ordering. Need something special? Submit a custom
                  furniture request with drawings and room sizes.
                </p>
                <div className="flex gap-2">
                  <Link
                    className="rounded-md bg-zinc-900 px-4 py-2 text-white"
                    href="#catalog"
                  >
                    Browse catalog
                  </Link>
                  <Link
                    className="rounded-md border px-4 py-2"
                    href="/custom-order"
                  >
                    Custom order
                  </Link>
                </div>
              </div>
              <img
                alt="Hero furniture"
                className="h-64 w-full rounded-xl object-cover"
                src="/cover.png"
              />
            </div>
          </div>
          <div id="catalog" className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Newest Arrivals</h2>
              {/* <Link href="/dashboard" className="text-sm text-zinc-600 underline">
                Admin Dashboard
              </Link> */}
            </div>
            <Suspense fallback={<div className="p-6">Loading products...</div>}>
              <ProductsGrid />
            </Suspense>
          </div>
        </section>
        <div className="">
          <footer className="bg-white text-black border-t">
            <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                {/* <h3 className="text-lg font-semibold mb-2">FurniX</h3> */}
                <div className="w-27 pb-2">
                  <img src="/logo.png" alt="" />
                </div>
                <p className="text-sm text-zinc-700">
                  Premium furniture for homes and businesses. Custom orders,
                  bulk pricing, and curated collections.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-md font-semibold mb-2">Explore</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/catalog">Catalog</Link>
                  </li>
                  <li>
                    <Link href="/custom-order">Custom Order</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>

              {/* Corporate */}
              <div>
                <h4 className="text-md font-semibold mb-2">Corporate</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/">Bulk Orders</Link>
                  </li>
                  <li>
                    <Link href="/">Distributor Portal</Link>
                  </li>
                  <li>
                    <Link href="/">Admin Dashboard</Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-md font-semibold mb-2">Get in Touch</h4>
                <p className="text-sm">
                  Email:
                  <a
                    href="mailto:sumonray146371@gmail.com"
                    className="underline hover:underline"
                  >
                    sumonray146371@gmail.com
                  </a>
                </p>
                <p className="text-sm">
                  Phone:
                  <a
                    href="tel:+8801763604565"
                    className=" hover:underline"
                  >
                    +880-176360-4565
                  </a>
                </p>

                <div className="mt-2 flex gap-3">
                  {/* Replace with actual icons if using MUI or Shadcn */}
                  <Link href="#" aria-label="Facebook">
                    FB
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    TW
                  </Link>
                  <Link href="#" aria-label="Instagram">
                    IG
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t mt-6 py-4 text-center text-sm text-zinc-600">
              © {new Date().getFullYear()} FurniX. All rights reserved.
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
