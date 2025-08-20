import type { Role, User } from "@/types"

// Demo JWT-like tokens. Replace with real JWT + rotation on Express server.
export function issueTokens(user: User) {
  const accessToken = btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 1000 * 60 * 15 }))
  const refreshToken = btoa(
    JSON.stringify({ sub: user.id, type: "refresh", exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }),
  )
  return { accessToken, refreshToken }
}

export function decodeAccess(token: string): { sub: string; role: Role; exp: number } | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp && Date.now() < payload.exp) return payload
    return null
  } catch {
    return null
  }
}
