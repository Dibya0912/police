"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCases } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Lock, Calendar, MapPin, Shield } from "lucide-react"
import CaseDetailsDialog from "./CaseDetailsDialog"
import type { Case } from "@/context/CaseContext"

interface CaseListProps {
  isAdmin: boolean
}

export default function CaseList({ isAdmin }: CaseListProps) {
  const { user } = useAuth()
  const { cases } = useCases()
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  const displayCases = isAdmin ? cases : cases

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-[#C9A227] text-[#3E2723]"
      case "investigating":
        return "bg-blue-600 text-white"
      case "closed":
        return "bg-green-700 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <>
      <div className="space-y-3">
        {displayCases.length === 0 ? (
          <Card className="police-card">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[#C9A227]" />
              <p className="text-[#5D4E37]">No cases available</p>
            </CardContent>
          </Card>
        ) : (
          displayCases.map((caseItem) => {
            const isMyDistrict = isAdmin || caseItem.district === user?.district
            const isRestricted = !isAdmin && caseItem.district !== user?.district

            return (
              <Card
                key={caseItem.id}
                className={`police-card transition-all ${
                  isMyDistrict ? "hover:shadow-md border-2 border-[#C9A227]" : "opacity-70 border-2 border-gray-400"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg text-[#3E2723]">{caseItem.title}</CardTitle>
                        {isRestricted && <Lock className="w-5 h-5 text-[#8B0000]" />}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-[#5D4E37]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-semibold">{caseItem.district}</span>
                        </div>
                        {isMyDistrict && !isAdmin && (
                          <Badge className="bg-green-700 text-white flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            My District - Full Access
                          </Badge>
                        )}
                        {isRestricted && <Badge className="bg-[#8B0000] text-white">Other District - View Only</Badge>}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>{caseItem.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#5D4E37] mb-4 line-clamp-2">{caseItem.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#5D4E37]">
                      <span className="font-semibold">{caseItem.evidence.length}</span> evidence submission(s)
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedCase(caseItem)}
                      className={
                        isMyDistrict
                          ? "bg-[#8B7355] hover:bg-[#6D5A43] text-white"
                          : "bg-gray-500 hover:bg-gray-600 text-white"
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isMyDistrict ? "View & Submit" : "View Only"}
                    </Button>
                  </div>
                  {isRestricted && (
                    <div className="mt-3 text-xs text-[#8B0000] font-semibold bg-[#FFF3CD] p-2 rounded flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      You cannot submit evidence for cases outside your district
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <CaseDetailsDialog
        caseItem={selectedCase}
        open={!!selectedCase}
        onOpenChange={(open) => !open && setSelectedCase(null)}
        isAdmin={isAdmin}
      />
    </>
  )
}
