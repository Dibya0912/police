"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCases } from "@/context/CaseContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"

const DISTRICTS = [
  "Central Delhi",
  "North Delhi",
  "South Delhi",
  "East Delhi",
  "West Delhi",
  "New Delhi",
  "North East Delhi",
  "North West Delhi",
  "South East Delhi",
  "South West Delhi",
  "Shahdara",
]

interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateCaseDialog({ open, onOpenChange }: CreateCaseDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [district, setDistrict] = useState("")
  const { user, getPoliceOfficersByDistrict } = useAuth()
  const { createCase, notifyDistrictOfficers } = useCases()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!district) {
      toast({
        title: "District Required",
        description: "Please select a district for this case",
        variant: "destructive",
      })
      return
    }

    const caseId = createCase({
      title,
      description,
      district,
      createdBy: user?.fullName || "Admin",
      status: "open",
    })

    const districtOfficers = getPoliceOfficersByDistrict(district)
    notifyDistrictOfficers(caseId, district, districtOfficers)

    toast({
      title: "Case Created",
      description: `Case assigned to ${district}. ${districtOfficers.length} officer(s) notified.`,
      className: "bg-green-700 text-white border-green-800",
    })

    setTitle("")
    setDescription("")
    setDistrict("")
    onOpenChange(false)
  }

  const officersCount = district ? getPoliceOfficersByDistrict(district).length : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="police-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#3E2723] flex items-center gap-2">Create New Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#3E2723] font-semibold">
              Case Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-[#C9A227]"
              placeholder="Brief case summary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#3E2723] font-semibold">
              Case Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-[#C9A227]"
              placeholder="Detailed case information..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district" className="text-[#3E2723] font-semibold">
              Assign to District <span className="text-[#8B0000]">*</span>
            </Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="border-[#C9A227]">
                <SelectValue placeholder="Select district..." />
              </SelectTrigger>
              <SelectContent className="bg-[#F5F1E8]">
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-start gap-2 mt-2">
              <div className="flex-1">
                <p className="text-xs text-[#5D4E37]">Only police from selected district will have full access</p>
              </div>
              {district && officersCount > 0 && (
                <div className="flex items-center gap-1 bg-[#C9A227] text-[#3E2723] px-3 py-1 rounded-full text-xs font-semibold">
                  <Bell className="w-3 h-3" />
                  {officersCount} officer{officersCount !== 1 ? "s" : ""} will be notified
                </div>
              )}
            </div>
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
              Create Case
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
