"use client"

import { useAuth } from "@/context/AuthContext"
import LoginForm from "@/components/LoginForm"
import Navbar from "@/components/Navbar"
import AdminDashboard from "@/components/AdminDashboard"
import PoliceDashboard from "@/components/PoliceDashboard"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {user.role === "admin" ? <AdminDashboard /> : <PoliceDashboard />}
      </main>
    </div>
  )
}
