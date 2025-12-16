"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCases } from "@/context/CaseContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SubmitEvidenceDialogProps {
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SubmitEvidenceDialog({ caseId, open, onOpenChange }: SubmitEvidenceDialogProps) {
  const [type, setType] = useState<"text" | "image" | "video">("text")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [contributionPercentage, setContributionPercentage] = useState<number>(50)
  const [contributionRole, setContributionRole] = useState<
    "Lead Investigator" | "Support Investigator" | "Field Assistance"
  >("Support Investigator")

  const { user } = useAuth()
  const { submitEvidence } = useCases()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    submitEvidence({
      caseId,
      officerId: user.id,
      officerName: user.fullName,
      officerRank: user.rank,
      type,
      content,
      description,
      contributionPercentage,
      contributionRole,
    })

    toast({
      title: "Evidence Submitted",
      description: `Your evidence has been recorded with ${contributionPercentage}% contribution claim`,
    })

    setType("text")
    setDescription("")
    setContent("")
    setContributionPercentage(50)
    setContributionRole("Support Investigator")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="police-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#3E2723]">Submit Evidence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert className="bg-[#FFF3CD] border-[#FFC107]">
            <AlertCircle className="h-4 w-4 text-[#856404]" />
            <AlertDescription className="text-[#856404] font-semibold">
              You must declare your contribution percentage and role. This helps prevent credit theft.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 p-4 bg-[#E8DDB5] rounded border-2 border-[#C9A227]">
            <div className="space-y-2">
              <Label htmlFor="contributionPercentage" className="text-[#3E2723] font-semibold">
                Contribution Percentage *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="contributionPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={contributionPercentage}
                  onChange={(e) => setContributionPercentage(Number(e.target.value))}
                  required
                  className="border-[#C9A227]"
                />
                <span className="text-[#3E2723] font-semibold">%</span>
              </div>
              <p className="text-xs text-[#5D4E37]">Estimate your contribution to this investigation (0-100%)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionRole" className="text-[#3E2723] font-semibold">
                Contribution Role *
              </Label>
              <Select value={contributionRole} onValueChange={(val: any) => setContributionRole(val)}>
                <SelectTrigger className="border-[#C9A227]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F1E8]">
                  <SelectItem value="Lead Investigator">Lead Investigator</SelectItem>
                  <SelectItem value="Support Investigator">Support Investigator</SelectItem>
                  <SelectItem value="Field Assistance">Field Assistance</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#5D4E37]">Your primary role in this investigation</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#3E2723] font-semibold">
              Evidence Type
            </Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger className="border-[#C9A227]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#F5F1E8]">
                <SelectItem value="text">Text Report</SelectItem>
                <SelectItem value="image">Image Evidence</SelectItem>
                <SelectItem value="video">Video Evidence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#3E2723] font-semibold">
              Evidence Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="border-[#C9A227]"
              placeholder="Describe the evidence..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-[#3E2723] font-semibold">
              Evidence Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="border-[#C9A227]"
              placeholder={
                type === "text"
                  ? "Enter detailed evidence information..."
                  : type === "image"
                    ? "Image URL or reference number..."
                    : "Video URL or reference number..."
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#C9A227]"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#8B7355] hover:bg-[#6D5A43] text-white">
              Submit Evidence
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
