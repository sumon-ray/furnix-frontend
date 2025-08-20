import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET() {
  const store = db()
  return NextResponse.json(store.categories)
}
