import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { CaseProvider } from "@/context/CaseContext"
import { Toaster } from "@/components/ui/toaster"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Police Case Evidence Management System",
  description: "Indian Police Department - Case Evidence Management Portal",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <AuthProvider>
          <CaseProvider>
            {children}
            <Toaster />
          </CaseProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
