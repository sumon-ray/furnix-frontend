"use client";

import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { useAppSelector } from "@/hooks/use-redux";
import { useGetMyCustomOrdersQuery } from "@/store/services/endpoints";
import { useEffect } from "react";

export default function CustomerCustomOrders() {
  const user = useAppSelector((s) => s.auth.user);

  const { data, isLoading, refetch } = useGetMyCustomOrdersQuery(undefined, {
    skip: !user?.email,
  });

  // Polling every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.email) refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.email, refetch]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!data || data.length === 0)
    return <div className="p-4 text-center text-gray-500">No orders found</div>;

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Custom Orders</h1>

        <div className="grid gap-6">
          {data.map((order) => (
            <div
              key={order._id}
              className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Order Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold">{order.name}</h2>
                  <p className="text-sm text-gray-500">{order.email}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "SUBMITTED"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "REVIEWING"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Attachments */}
              {order.attachments && order.attachments.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {order.attachments.map((file: string, i: number) => {
                    const fileUrl = file.startsWith("http")
                      ? file
                      : `/uploads/${file}`;

                    if (file.endsWith(".pdf")) {
                      return (
                        <a
                          key={i}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-50 text-blue-800 rounded text-sm font-medium hover:bg-blue-100 transition"
                        >
                          PDF #{i + 1}
                        </a>
                      );
                    }

                    return (
                      <a key={i} href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={fileUrl}
                          alt={`Attachment ${i + 1}`}
                          className="h-20 w-20 rounded-lg object-cover border hover:scale-105 transition-transform"
                        />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
