"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCases, type Evidence } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, XCircle, Clock, Shield, Award, TrendingDown, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InquiryPanel() {
  const { cases, updateEvidenceStatus } = useCases()
  const { updateUserPoints, updateUserRank } = useAuth()
  const { toast } = useToast()
  const [selectedCase, setSelectedCase] = useState<string>("")
  const [selectedEvidence, setSelectedEvidence] = useState<string>("")
  const [customPoints, setCustomPoints] = useState<number>(0)
  const [penaltyReason, setPenaltyReason] = useState<string>("")
  const [showPointAdjustment, setShowPointAdjustment] = useState(false)

  const casesWithEvidence = cases.filter((c) => c.evidence.length > 1)
  const selectedCaseData = cases.find((c) => c.id === selectedCase)

  const handleVerdict = (evidence: Evidence, verdict: "genuine" | "credit-theft" | "malicious") => {
    updateEvidenceStatus(evidence.id, verdict)

    const currentOfficer = mockOfficers.find((o) => o.id === evidence.officerId)
    if (currentOfficer) {
      let newPoints = currentOfficer.points
      let newRank = currentOfficer.rank

      switch (verdict) {
        case "genuine":
          newPoints += 10
          toast({
            title: "Marked as Genuine",
            description: `${evidence.officerName} awarded +10 points`,
          })
          break
        case "credit-theft":
          newPoints -= 20
          if (newPoints < 50) newRank = downgradeRank(currentOfficer.rank)
          toast({
            title: "Credit Theft Detected",
            description: `${evidence.officerName}: -20 points penalty applied`,
            variant: "destructive",
          })
          break
        case "malicious":
          newPoints -= 50
          newRank = downgradeRank(currentOfficer.rank)
          toast({
            title: "Malicious Activity",
            description: `${evidence.officerName}: -50 points, rank downgraded`,
            variant: "destructive",
          })
          break
      }

      updateUserPoints(evidence.officerId, Math.max(0, newPoints))
      if (newRank !== currentOfficer.rank) {
        updateUserRank(evidence.officerId, newRank)
      }
    }
  }

  const handleManualPointAdjustment = (evidence: Evidence) => {
    const currentOfficer = mockOfficers.find((o) => o.id === evidence.officerId)
    if (currentOfficer) {
      const newPoints = currentOfficer.points + customPoints
      updateUserPoints(evidence.officerId, Math.max(0, newPoints))

      toast({
        title: customPoints > 0 ? "Bonus Points Awarded" : "Penalty Applied",
        description: `${evidence.officerName}: ${customPoints > 0 ? "+" : ""}${customPoints} points. Reason: ${penaltyReason}`,
        variant: customPoints < 0 ? "destructive" : "default",
      })

      setShowPointAdjustment(false)
      setCustomPoints(0)
      setPenaltyReason("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="police-card border-4 border-[#8B0000]">
        <CardHeader className="bg-[#C2B280]">
          <CardTitle className="text-xl text-[#3E2723] flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#8B0000]" />
            Internal Affairs - Contribution Verification & Point Control
          </CardTitle>
          <p className="text-sm text-[#5D4E37] mt-2">
            Review evidence submissions, verify contributions, and award/penalize points
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-[#3E2723]">Select Case for Review</label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger className="border-[#C9A227]">
                <SelectValue placeholder="Choose a case with multiple submissions..." />
              </SelectTrigger>
              <SelectContent className="bg-[#F5F1E8]">
                {casesWithEvidence.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title} ({c.evidence.length} submissions)
                    {c.requiresVerification && (
                      <Badge className="ml-2 bg-[#8B0000] text-white text-xs">Requires Verification</Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCaseData && (
            <div className="space-y-4">
              <div className="bg-[#E8DDB5] p-4 rounded border-2 border-[#C9A227]">
                <h3 className="font-semibold text-[#3E2723] mb-2">Case: {selectedCaseData.title}</h3>
                <p className="text-sm text-[#5D4E37]">{selectedCaseData.description}</p>
                {selectedCaseData.requiresVerification && (
                  <Badge className="mt-2 bg-[#8B0000] text-white">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Auto-flagged: Multiple high contribution claims detected
                  </Badge>
                )}
              </div>

              <div className="gold-strip h-1 my-4"></div>

              <Card className="bg-[#FFF3CD] border-2 border-[#FFC107]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-[#856404] flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Contribution Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCaseData.evidence.map((ev, idx) => (
                      <div key={ev.id} className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#3E2723]">{ev.officerName}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{ev.contributionRole}</Badge>
                          <Badge
                            className={
                              ev.contributionPercentage > 50 ? "bg-[#8B0000] text-white" : "bg-[#C9A227] text-[#3E2723]"
                            }
                          >
                            {ev.contributionPercentage}% claimed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <h4 className="font-semibold text-[#3E2723] flex items-center gap-2 mt-6">
                <AlertTriangle className="w-5 h-5 text-[#8B0000]" />
                Evidence Submissions Comparison (Side-by-Side)
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedCaseData.evidence.map((evidence, index) => (
                  <Card
                    key={evidence.id}
                    className={`
                      ${evidence.status === "genuine" ? "border-green-700" : ""}
                      ${evidence.status === "credit-theft" ? "border-[#C9A227]" : ""}
                      ${evidence.status === "malicious" ? "border-[#8B0000]" : "border-[#C9A227]"}
                      border-4
                    `}
                  >
                    <CardHeader className="bg-[#C2B280] pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base text-[#3E2723]">Submission #{index + 1}</CardTitle>
                          <p className="text-sm font-semibold text-[#3E2723] mt-1">{evidence.officerName}</p>
                          <Badge variant="outline" className="mt-1">
                            {evidence.officerRank}
                          </Badge>
                        </div>
                        {evidence.status && evidence.status !== "pending" && (
                          <Badge
                            className={
                              evidence.status === "genuine"
                                ? "bg-green-700 text-white"
                                : evidence.status === "credit-theft"
                                  ? "bg-[#C9A227] text-[#3E2723]"
                                  : "bg-[#8B0000] text-white"
                            }
                          >
                            {evidence.status === "genuine" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {evidence.status === "credit-theft" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {evidence.status === "malicious" && <XCircle className="w-3 h-3 mr-1" />}
                            {evidence.status}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="bg-[#E8DDB5] p-3 rounded border-2 border-[#C9A227]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-[#3E2723]">Claimed Contribution:</span>
                            <Badge
                              className={
                                evidence.contributionPercentage > 50
                                  ? "bg-[#8B0000] text-white"
                                  : "bg-[#8B7355] text-white"
                              }
                            >
                              {evidence.contributionPercentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#3E2723]">Role:</span>
                            <Badge
                              className={
                                evidence.contributionRole === "Lead Investigator"
                                  ? "bg-[#C9A227] text-[#3E2723]"
                                  : "bg-gray-500 text-white"
                              }
                            >
                              {evidence.contributionRole}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[#5D4E37] flex items-center gap-1 mb-2">
                            <Clock className="w-3 h-3" />
                            {new Date(evidence.timestamp).toLocaleString()}
                          </p>
                          <div className="bg-[#F5F1E8] p-3 rounded">
                            <p className="text-xs font-semibold text-[#3E2723] mb-1">Description:</p>
                            <p className="text-sm text-[#5D4E37] mb-2">{evidence.description}</p>
                            <p className="text-xs font-semibold text-[#3E2723] mb-1">Content:</p>
                            <p className="text-sm text-[#5D4E37]">{evidence.content}</p>
                          </div>
                        </div>

                        {(!evidence.status || evidence.status === "pending") && (
                          <div className="space-y-3 pt-2 border-t-2 border-[#C9A227]">
                            <p className="text-xs font-semibold text-[#3E2723]">Committee Verdict:</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleVerdict(evidence, "genuine")}
                                className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Genuine (+10)
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerdict(evidence, "credit-theft")}
                                className="flex-1 bg-[#C9A227] hover:bg-[#B8911F] text-[#3E2723] text-xs"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Theft (-20)
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerdict(evidence, "malicious")}
                                className="flex-1 bg-[#8B0000] hover:bg-[#6B0000] text-white text-xs"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Malicious (-50)
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedEvidence(evidence.id)
                                setShowPointAdjustment(!showPointAdjustment)
                              }}
                              className="w-full border-[#C9A227] text-xs"
                            >
                              <Award className="w-3 h-3 mr-1" />
                              Custom Point Adjustment
                            </Button>

                            {showPointAdjustment && selectedEvidence === evidence.id && (
                              <Card className="bg-[#FFF3CD] border-2 border-[#FFC107]">
                                <CardContent className="pt-4 space-y-3">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-[#856404]">Points Adjustment</Label>
                                    <Input
                                      type="number"
                                      value={customPoints}
                                      onChange={(e) => setCustomPoints(Number(e.target.value))}
                                      placeholder="Enter points (+ or -)"
                                      className="text-sm"
                                    />
                                    <p className="text-xs text-[#856404]">
                                      Positive for rewards, negative for penalties
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-[#856404]">Reason</Label>
                                    <Textarea
                                      value={penaltyReason}
                                      onChange={(e) => setPenaltyReason(e.target.value)}
                                      placeholder="Reason for adjustment..."
                                      rows={2}
                                      className="text-sm"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleManualPointAdjustment(evidence)}
                                      className={
                                        customPoints > 0
                                          ? "flex-1 bg-green-700 hover:bg-green-800 text-white text-xs"
                                          : "flex-1 bg-[#8B0000] hover:bg-[#6B0000] text-white text-xs"
                                      }
                                    >
                                      {customPoints > 0 ? (
                                        <Award className="w-3 h-3 mr-1" />
                                      ) : (
                                        <TrendingDown className="w-3 h-3 mr-1" />
                                      )}
                                      Apply {customPoints > 0 ? "Reward" : "Penalty"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setShowPointAdjustment(false)}
                                      className="text-xs"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}

                        {evidence.status && evidence.status !== "pending" && (
                          <div className="pt-2 border-t-2 border-[#C9A227]">
                            <Badge
                              className={
                                evidence.status === "genuine"
                                  ? "bg-green-700 text-white"
                                  : evidence.status === "credit-theft"
                                    ? "bg-[#C9A227] text-[#3E2723]"
                                    : "bg-[#8B0000] text-white"
                              }
                            >
                              Verdict: {evidence.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!selectedCase && (
            <div className="text-center py-12 text-[#5D4E37]">
              <Shield className="w-16 h-16 mx-auto mb-4 text-[#C9A227]" />
              <p>Select a case above to begin inquiry review</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const mockOfficers = [
  { id: "police-1", points: 100, rank: "Inspector" },
  { id: "police-2", points: 85, rank: "Sub-Inspector" },
  { id: "police-3", points: 95, rank: "Inspector" },
  { id: "police-4", points: 70, rank: "Constable" },
]

function downgradeRank(currentRank: string): string {
  const rankHierarchy = ["Constable", "Head Constable", "Sub-Inspector", "Inspector", "Superintendent"]
  const currentIndex = rankHierarchy.indexOf(currentRank)
  if (currentIndex > 0) {
    return rankHierarchy[currentIndex - 1]
  }
  return currentRank
}
