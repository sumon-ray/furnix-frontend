"use client"

import React, { useState } from "react"
import {
  useAssignOrderMutation,
  useGetDistributorsQuery,
  useListOrdersQuery,
} from "@/store/services/endpoints"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { toast } from "react-toastify"
import { SidebarLayout } from "@/components/dashboard/sidebar-layout"

const AssignOrderDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const userRole = user?.role
  const userId = user?._id

  const { data: orders, isLoading: ordersLoading, refetch } = useListOrdersQuery({})
  console.log("User Role:", userRole)
  console.log("Orders from API:", orders)
  const { data: distributors, isLoading: distLoading } = useGetDistributorsQuery()
  const [assignOrder] = useAssignOrderMutation()
  const [selectedDistributor, setSelectedDistributor] = useState<{ [key: string]: string }>({})

  if (ordersLoading || distLoading) return <div>Loading...</div>
  if (!orders || orders.length === 0) return <div>No orders found</div>

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN"

  // 🔹 Filter orders for distributor
  const visibleOrders = isAdmin
    ? orders
    : orders.filter((o) => o.distributorId === userId)

  const handleAssign = async (orderId: string) => {
    const distributorId = selectedDistributor[orderId]
    if (!distributorId) return toast.error("Select a distributor first")
    try {
      await assignOrder({ orderId, distributorId }).unwrap()
      toast.success("Order assigned successfully")
      refetch()
    } catch (err) {
      toast.error("Failed to assign order")
      console.error(err)
    }
  }

  return (
   <SidebarLayout>
     <div>
      <h1 className="text-xl text-center font-bold mb-4">Orders Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr className="">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Status</th>
            {isAdmin && <th className="p-2 border">Assign Distributor</th>}
            {isAdmin && <th className="p-2 border">Action</th>}
          </tr>
        </thead>
      <tbody>
  {orders?.map((order) => {
    // Admin সব order দেখবে, Distributor শুধু নিজের assigned order
    // if (!isAdmin && order.distributorId !== userIdFromRedux) return null;

    return (
      <tr key={order._id} className="text-center border">
        <td className="p-2 border">{order._id}</td>
        <td className="p-2 border">{order.customerName || order.address?.fullName}</td>
        <td className="p-2 border">{order.status}</td>

        {isAdmin && (
          <>
            <td className="p-2 border">
              <select 
                value={selectedDistributor[order._id] || ""}
                onChange={(e) =>
                  setSelectedDistributor((prev) => ({
                    ...prev,
                    [order._id]: e.target.value,
                  }))
                }
                className="border p-1 rounded"
              >
                <option value="">Select Distributor</option>
                {distributors?.map((dist) => (
                  <option key={dist._id} value={dist._id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="p-2 border">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleAssign(order._id)}
              >
                Assign
              </button>
            </td>
          </>
        )}
      </tr>
    )
  })}
</tbody>

      </table>
    </div>
   </SidebarLayout>
  )
}

export default AssignOrderDashboard
