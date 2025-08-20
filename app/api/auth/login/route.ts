import { type NextRequest, NextResponse } from "next/server"
import { db, verifyHash } from "@/lib/mock-db"
import { issueTokens } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body as { email: string; password: string }
  const store = db()
  const user = store.users.find((u) => u.email === email)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 })
  const passHash = store.passwords[email]
  if (!verifyHash(password, passHash)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const tokens = issueTokens(user)
  store.refreshTokens[user.id] = tokens.refreshToken
  return NextResponse.json({ user, ...tokens })
}
