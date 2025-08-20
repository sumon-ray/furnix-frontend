import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { issueTokens } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const store = db()
  // demo: pick first user
  const user = store.users[0]
  const tok = issueTokens(user)
  return NextResponse.json({ user, ...tok })
}
