"use client"

import Link from "next/link"
import { useAppSelector } from "@/hooks/use-redux"
import { ShoppingCart, UserCircle2, Search, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { setSearch } from "@/store/slices/ui-slice"
import { useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation" // Next 13 router

export function SiteHeader() {
  const dispatch = useDispatch()
  const router = useRouter()
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0))
  const user = useAppSelector((s) => s.auth.user)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    // 1️⃣ Dispatch Redux logout
    dispatch({ type: "auth/logout" }) // replace with your actual logout action

    // 2️⃣ Clear localStorage / cookies if needed
    localStorage.removeItem("authToken")

    // 3️⃣ Close dropdown
    setDropdownOpen(false)

    // 4️⃣ Redirect to login
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:gap-6 sm:px-6">
        {/* <Link href="/" className="font-semibold tracking-tight">
          FurniX
        </Link> */}
        <div className="w-20">
        <Link href="/">
    <img  src="/logo.png" alt="Logo" className="cursor-pointer" />
  </Link>
        </div>

        <form className="ml-2 hidden flex-1 items-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search furniture, materials, colors..."
              className="pl-9"
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <Link href="/custom-order">
            <Button variant="outline" size="sm">
              Custom Order
            </Button>
          </Link>


          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[11px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <UserCircle2 className="h-5 w-5" />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-md z-50">
                {user ? (
                  <div className="flex flex-col">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100 text-left w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm hover:bg-zinc-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

        
        </nav>
      </div>
    </header>
  )
}
