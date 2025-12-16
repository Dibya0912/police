"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  username: string
  role: "admin" | "police"
  district?: string
  rank: string
  points: number
  fullName: string
  email?: string
  policeStation?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  signup: (userData: {
    username: string
    password: string
    fullName: string
    email: string
    policeStation: string
    district: string
  }) => { success: boolean; error?: string }
  logout: () => void
  updateUserPoints: (userId: string, points: number) => void
  updateUserRank: (userId: string, rank: string) => void
  getPoliceOfficersByDistrict: (district: string) => string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: Record<string, User & { password: string }> = {
  admin: {
    id: "admin-1",
    username: "admin",
    password: "admin123",
    role: "admin",
    rank: "Superintendent",
    points: 0,
    fullName: "Admin Singh",
    email: "admin@police.gov.in",
  },
  police1: {
    id: "police-1",
    username: "police1",
    password: "police123",
    role: "police",
    district: "Central Delhi",
    policeStation: "Connaught Place PS",
    rank: "Inspector",
    points: 100,
    fullName: "Rajesh Kumar",
    email: "rajesh@police.gov.in",
  },
  police2: {
    id: "police-2",
    username: "police2",
    password: "police123",
    role: "police",
    district: "Central Delhi",
    policeStation: "Paharganj PS",
    rank: "Sub-Inspector",
    points: 85,
    fullName: "Amit Sharma",
    email: "amit@police.gov.in",
  },
  police3: {
    id: "police-3",
    username: "police3",
    password: "police123",
    role: "police",
    district: "South Delhi",
    policeStation: "Hauz Khas PS",
    rank: "Inspector",
    points: 95,
    fullName: "Priya Verma",
    email: "priya@police.gov.in",
  },
  police4: {
    id: "police-4",
    username: "police4",
    password: "police123",
    role: "police",
    district: "North Delhi",
    policeStation: "Civil Lines PS",
    rank: "Constable",
    points: 70,
    fullName: "Suresh Yadav",
    email: "suresh@police.gov.in",
  },
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState(mockUsers)

  useEffect(() => {
    const savedUser = localStorage.getItem("policeUser")
    const savedUsers = localStorage.getItem("policeUsers")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const foundUser = users[username]
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("policeUser", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = (userData: {
    username: string
    password: string
    fullName: string
    email: string
    policeStation: string
    district: string
  }): { success: boolean; error?: string } => {
    // Check if username already exists
    if (users[userData.username]) {
      return { success: false, error: "Username already exists" }
    }

    // Check if email already exists
    const emailExists = Object.values(users).some((u) => u.email === userData.email)
    if (emailExists) {
      return { success: false, error: "Email already registered" }
    }

    // Create new police officer
    const newUser: User & { password: string } = {
      id: `police-${Date.now()}`,
      username: userData.username,
      password: userData.password,
      role: "police",
      district: userData.district, // District is now mandatory and fixed
      policeStation: userData.policeStation,
      rank: "Constable", // Default rank for new officers
      points: 0,
      fullName: userData.fullName,
      email: userData.email,
    }

    const updatedUsers = { ...users, [userData.username]: newUser }
    setUsers(updatedUsers)
    localStorage.setItem("policeUsers", JSON.stringify(updatedUsers))

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("policeUser", JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("policeUser")
  }

  const updateUserPoints = (userId: string, points: number) => {
    setUsers((prev) => {
      const updatedUsers = { ...prev }
      Object.keys(updatedUsers).forEach((key) => {
        if (updatedUsers[key].id === userId) {
          updatedUsers[key].points = points
        }
      })
      localStorage.setItem("policeUsers", JSON.stringify(updatedUsers))
      return updatedUsers
    })

    if (user && user.id === userId) {
      const updatedUser = { ...user, points }
      setUser(updatedUser)
      localStorage.setItem("policeUser", JSON.stringify(updatedUser))
    }
  }

  const updateUserRank = (userId: string, rank: string) => {
    setUsers((prev) => {
      const updatedUsers = { ...prev }
      Object.keys(updatedUsers).forEach((key) => {
        if (updatedUsers[key].id === userId) {
          updatedUsers[key].rank = rank
        }
      })
      localStorage.setItem("policeUsers", JSON.stringify(updatedUsers))
      return updatedUsers
    })

    if (user && user.id === userId) {
      const updatedUser = { ...user, rank }
      setUser(updatedUser)
      localStorage.setItem("policeUser", JSON.stringify(updatedUser))
    }
  }

  const getPoliceOfficersByDistrict = (district: string): string[] => {
    return Object.values(users)
      .filter((u) => u.role === "police" && u.district === district)
      .map((u) => u.id)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUserPoints, updateUserRank, getPoliceOfficersByDistrict }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
