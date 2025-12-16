"use client"

import { useAuth } from "@/context/AuthContext"
import { Shield, LogOut, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div>
      <nav className="khakhi-bg border-b-4 border-[#C9A227]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#3E2723]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">POLICE EVIDENCE MANAGEMENT</h1>
                <p className="text-xs text-[#E8DDB5]">Government of India</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-sm font-semibold text-white">{user.fullName}</p>
                  <div className="flex items-center gap-1 bg-[#C9A227] px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-[#3E2723]" fill="#3E2723" />
                    <span className="text-xs font-bold text-[#3E2723]">{user.rank}</span>
                  </div>
                </div>
                <p className="text-xs text-[#E8DDB5]">
                  {user.role === "admin" ? "Administrator" : `District: ${user.district}`}
                </p>
                {user.role === "police" && (
                  <p className="text-xs text-[#C9A227] font-semibold">Points: {user.points}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="bg-[#8B7355] text-white border-[#C9A227] hover:bg-[#6D5A43]"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Gold strip under navbar */}
      <div className="gold-strip h-1"></div>
    </div>
  )
}
