import { type NextRequest, NextResponse } from "next/server"
import { db, hash, uid } from "@/lib/mock-db"

export async function POST(req: NextRequest) {
  const b = await req.json()
  const { name, email, password, role } = b as { name: string; email: string; password: string; role?: string }
  const store = db()
  if (store.users.some((u) => u.email === email)) return NextResponse.json({ error: "Email exists" }, { status: 400 })
  const user = { id: uid("u"), name, email, role: (role as any) || "CUSTOMER", verified: false }
  store.users.push(user as any)
  store.passwords[email] = hash(password)
  return NextResponse.json({ ok: true })
}
