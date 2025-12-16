"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, User, Upload, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SubmitEvidenceDialog from "./SubmitEvidenceDialog"
import type { Case } from "@/context/CaseContext"

interface CaseDetailsDialogProps {
  caseItem: Case | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}

export default function CaseDetailsDialog({ caseItem, open, onOpenChange, isAdmin }: CaseDetailsDialogProps) {
  const { user } = useAuth()
  const [showSubmitEvidence, setShowSubmitEvidence] = useState(false)

  if (!caseItem) return null

  const canSubmitEvidence = !isAdmin && caseItem.district === user?.district
  const isOtherDistrict = !isAdmin && caseItem.district !== user?.district

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="police-card max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <DialogTitle className="text-2xl text-[#3E2723]">{caseItem.title}</DialogTitle>
                  {isOtherDistrict && <Lock className="w-5 h-5 text-[#8B0000]" />}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-[#5D4E37]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">{caseItem.district}</span>
                    {canSubmitEvidence && <Badge className="ml-1 bg-green-700 text-white">Your District</Badge>}
                    {isOtherDistrict && <Badge className="ml-1 bg-[#8B0000] text-white">Other District</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Created by: {caseItem.createdBy}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-[#C9A227] text-[#3E2723]">{caseItem.status}</Badge>
            </div>
          </DialogHeader>

          {isOtherDistrict && (
            <Alert className="bg-[#FFF3CD] border-[#FFC107]">
              <AlertCircle className="h-4 w-4 text-[#856404]" />
              <AlertDescription className="text-[#856404] font-semibold">
                This case belongs to {caseItem.district}. You can view details but cannot submit evidence.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="bg-[#C2B280]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#C9A227]">
                Case Details
              </TabsTrigger>
              <TabsTrigger value="evidence" className="data-[state=active]:bg-[#C9A227]">
                Evidence ({caseItem.evidence.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-[#3E2723] mb-2">Description</h3>
                <p className="text-[#5D4E37] bg-[#E8DDB5] p-4 rounded">{caseItem.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4 mt-4">
              {canSubmitEvidence && (
                <Button
                  onClick={() => setShowSubmitEvidence(true)}
                  className="w-full bg-[#8B7355] hover:bg-[#6D5A43] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Evidence
                </Button>
              )}

              {isOtherDistrict && (
                <Button disabled className="w-full bg-gray-400 text-gray-700 cursor-not-allowed">
                  <Lock className="w-4 h-4 mr-2" />
                  Cannot Submit Evidence - Different District
                </Button>
              )}

              <div className="space-y-3">
                {caseItem.evidence.length === 0 ? (
                  <div className="text-center py-8 text-[#5D4E37]">No evidence submitted yet</div>
                ) : (
                  caseItem.evidence.map((evidence) => (
                    <div key={evidence.id} className="bg-[#F5F1E8] p-4 rounded border-2 border-[#C9A227]">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#3E2723]">{evidence.officerName}</span>
                            <Badge variant="outline" className="text-xs">
                              {evidence.officerRank}
                            </Badge>
                            <Badge className="bg-[#8B7355] text-white text-xs">
                              {evidence.contributionPercentage}% - {evidence.contributionRole}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#5D4E37] mt-1">{new Date(evidence.timestamp).toLocaleString()}</p>
                        </div>
                        {evidence.status && (
                          <Badge
                            className={
                              evidence.status === "genuine"
                                ? "bg-green-700 text-white"
                                : evidence.status === "credit-theft"
                                  ? "bg-[#C9A227] text-[#3E2723]"
                                  : evidence.status === "malicious"
                                    ? "bg-[#8B0000] text-white"
                                    : "bg-gray-500 text-white"
                            }
                          >
                            {evidence.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#3E2723] mb-2">{evidence.description}</p>
                      <div className="bg-[#E8DDB5] p-3 rounded text-sm text-[#5D4E37]">
                        <Badge className="mb-2 bg-[#8B7355] text-white">{evidence.type}</Badge>
                        <p>{evidence.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {canSubmitEvidence && (
        <SubmitEvidenceDialog caseId={caseItem.id} open={showSubmitEvidence} onOpenChange={setShowSubmitEvidence} />
      )}
    </>
  )
}
