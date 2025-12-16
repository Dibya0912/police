"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DISTRICTS = [
  "Central Delhi",
  "North Delhi",
  "South Delhi",
  "East Delhi",
  "West Delhi",
  "North East Delhi",
  "North West Delhi",
  "South East Delhi",
  "South West Delhi",
  "Shahdara",
  "New Delhi",
]

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [policeStation, setPoliceStation] = useState("")
  const [district, setDistrict] = useState("")
  const [error, setError] = useState("")
  const { login, signup } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(username, password)
    if (!success) {
      setError("Invalid credentials. Please try again.")
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate all fields
    if (!username || !password || !fullName || !email || !policeStation || !district) {
      setError("All fields are required")
      return
    }

    // Validate email format
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    const result = signup({
      username,
      password,
      fullName,
      email,
      policeStation,
      district, // District is mandatory and will be fixed for this officer
    })

    if (!result.success) {
      setError(result.error || "Signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md police-card shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-[#C9A227] rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-[#3E2723]" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#3E2723]">Police Evidence Portal</CardTitle>
            <CardDescription className="text-[#5D4E37] mt-2">
              Government of India - Authorized Access Only
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "outline"}
              onClick={() => setMode("login")}
              className={mode === "login" ? "flex-1 bg-[#8B7355] hover:bg-[#6D5A43]" : "flex-1"}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "outline"}
              onClick={() => setMode("signup")}
              className={mode === "signup" ? "flex-1 bg-[#8B7355] hover:bg-[#6D5A43]" : "flex-1"}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Signup
            </Button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-[#8B0000] text-white border-[#6B0000]">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#3E2723] font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#3E2723] font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <Button type="submit" className="w-full bg-[#8B7355] hover:bg-[#6D5A43] text-white font-semibold">
                Login to Portal
              </Button>

              <div className="text-xs text-center text-[#5D4E37] mt-4 p-3 bg-[#E8DDB5] rounded">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Admin: admin / admin123</p>
                <p>Police: police1 / police123</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-[#8B0000] text-white border-[#6B0000]">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-fullname" className="text-[#3E2723] font-semibold">
                  Officer Name <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-[#3E2723] font-semibold">
                  Email <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@police.gov.in"
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-[#3E2723] font-semibold">
                  Username <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-[#3E2783] font-semibold">
                  Password <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-station" className="text-[#3E2723] font-semibold">
                  Police Station <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="signup-station"
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  required
                  placeholder="e.g., Connaught Place PS"
                  className="border-[#C9A227] focus:ring-[#C9A227]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-district" className="text-[#3E2723] font-semibold">
                  District <span className="text-[#8B0000]">*</span>
                </Label>
                <Select value={district} onValueChange={setDistrict} required>
                  <SelectTrigger className="border-[#C9A227] focus:ring-[#C9A227]">
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((dist) => (
                      <SelectItem key={dist} value={dist}>
                        {dist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#8B0000] font-semibold">
                  Note: District cannot be changed after registration
                </p>
              </div>

              <Button type="submit" className="w-full bg-[#8B7355] hover:bg-[#6D5A43] text-white font-semibold">
                Register Officer
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
