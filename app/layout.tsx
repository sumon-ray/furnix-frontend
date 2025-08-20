import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProviders } from "@/providers/app-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FurniX - Furniture Commerce",
  description: "B2C & B2B furniture e-commerce with custom orders",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "FurniX",
    description: "Furniture e-commerce for retail & corporate buyers",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FurniX",
    description: "Furniture e-commerce for retail & corporate buyers",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
    generator: 'next js'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
