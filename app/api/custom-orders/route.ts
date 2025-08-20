import { type NextRequest, NextResponse } from "next/server"
import { db, uid } from "@/lib/mock-db"
import type { CustomOrder } from "@/types"

export async function GET(req: NextRequest) {
  const store = db()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  let items = store.customOrders
  if (status) items = items.filter((c) => c.status === status)
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const store = db()
  const form = await req.formData()
  const files = form.getAll("files")
  const attachments: string[] = []
  for (const f of files) {
    if (typeof f === "string") continue
    const array = await f.arrayBuffer()
    const base64 = `data:${f.type};base64,${Buffer.from(array).toString("base64")}`
    attachments.push(base64)
  }
  const item: CustomOrder = {
    id: uid("co"),
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    details: String(form.get("details") ?? ""),
    roomMeasurements: form.get("roomMeasurements") ? String(form.get("roomMeasurements")) : undefined,
    attachments,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
  }
  store.customOrders.unshift(item)
  return NextResponse.json(item)
}
