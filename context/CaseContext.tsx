"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Evidence {
  id: string
  caseId: string
  officerId: string
  officerName: string
  officerRank: string
  type: "text" | "image" | "video"
  content: string
  description: string
  timestamp: string
  status?: "genuine" | "credit-theft" | "malicious" | "pending"
  contributionPercentage: number
  contributionRole: "Lead Investigator" | "Support Investigator" | "Field Assistance"
}

export interface AdminNotification {
  id: string
  caseId: string
  caseTitle: string
  officerId: string
  officerName: string
  policeStation: string
  contributionPercentage: number
  timestamp: string
  read: boolean
}

export interface Case {
  id: string
  title: string
  description: string
  district: string
  createdBy: string
  createdAt: string
  status: "open" | "investigating" | "closed"
  evidence: Evidence[]
  notifications: string[]
  requiresVerification?: boolean // Auto-flagged if multiple high contributions
}

interface CaseContextType {
  cases: Case[]
  adminNotifications: AdminNotification[]
  createCase: (caseData: Omit<Case, "id" | "createdAt" | "evidence" | "notifications">) => string
  submitEvidence: (evidence: Omit<Evidence, "id" | "timestamp">) => void
  updateEvidenceStatus: (evidenceId: string, status: Evidence["status"]) => void
  getCasesByDistrict: (district: string) => Case[]
  getAllCases: () => Case[]
  notifyDistrictOfficers: (caseId: string, district: string, officerIds: string[]) => void
  markNotificationRead: (notificationId: string) => void
  getUnreadNotificationCount: () => number
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([
    {
      id: "case-1",
      title: "Robbery at Connaught Place",
      description: "Armed robbery reported at a jewelry store. Two suspects fled on motorcycle.",
      district: "Central Delhi",
      createdBy: "Admin Singh",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "investigating",
      evidence: [
        {
          id: "ev-1",
          caseId: "case-1",
          officerId: "police-1",
          officerName: "Rajesh Kumar",
          officerRank: "Inspector",
          type: "text",
          content: "CCTV footage shows two suspects wearing helmets",
          description: "Initial investigation report with CCTV analysis",
          timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "genuine",
          contributionPercentage: 90,
          contributionRole: "Lead Investigator",
        },
      ],
      notifications: ["police-1", "police-2"],
    },
    {
      id: "case-2",
      title: "Hit and Run - Ring Road",
      description: "Vehicle collision with pedestrian. Driver absconded from scene.",
      district: "South Delhi",
      createdBy: "Admin Singh",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "open",
      evidence: [],
      notifications: ["police-3"],
    },
  ])

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([])

  const createCase = (caseData: Omit<Case, "id" | "createdAt" | "evidence" | "notifications">) => {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
      evidence: [],
      notifications: [],
    }
    setCases((prev) => [newCase, ...prev])
    return newCase.id
  }

  const submitEvidence = (evidence: Omit<Evidence, "id" | "timestamp">) => {
    const newEvidence: Evidence = {
      ...evidence,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === evidence.caseId) {
          const updatedEvidence = [...c.evidence, newEvidence]

          // Check if verification is needed (multiple officers claiming >50%)
          const highContributors = updatedEvidence.filter((e) => e.contributionPercentage > 50)
          const requiresVerification = highContributors.length > 1

          return {
            ...c,
            evidence: updatedEvidence,
            requiresVerification,
          }
        }
        return c
      }),
    )

    // Create admin notification
    const caseData = cases.find((c) => c.id === evidence.caseId)
    if (caseData) {
      const notification: AdminNotification = {
        id: `notif-${Date.now()}`,
        caseId: evidence.caseId,
        caseTitle: caseData.title,
        officerId: evidence.officerId,
        officerName: evidence.officerName,
        policeStation: "", // Will be populated from user context
        contributionPercentage: evidence.contributionPercentage,
        timestamp: new Date().toISOString(),
        read: false,
      }
      setAdminNotifications((prev) => [notification, ...prev])
    }
  }

  const updateEvidenceStatus = (evidenceId: string, status: Evidence["status"]) => {
    setCases((prev) =>
      prev.map((c) => ({
        ...c,
        evidence: c.evidence.map((e) => (e.id === evidenceId ? { ...e, status } : e)),
      })),
    )
  }

  const getCasesByDistrict = (district: string) => {
    return cases.filter((c) => c.district === district)
  }

  const getAllCases = () => {
    return cases
  }

  const notifyDistrictOfficers = (caseId: string, district: string, officerIds: string[]) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId && c.district === district ? { ...c, notifications: officerIds } : c)),
    )
  }

  const markNotificationRead = (notificationId: string) => {
    setAdminNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const getUnreadNotificationCount = () => {
    return adminNotifications.filter((n) => !n.read).length
  }

  return (
    <CaseContext.Provider
      value={{
        cases,
        adminNotifications,
        createCase,
        submitEvidence,
        updateEvidenceStatus,
        getCasesByDistrict,
        getAllCases,
        notifyDistrictOfficers,
        markNotificationRead,
        getUnreadNotificationCount,
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export const useCases = () => {
  const context = useContext(CaseContext)
  if (context === undefined) {
    throw new Error("useCases must be used within a CaseProvider")
  }
  return context
}
