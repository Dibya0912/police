"use client"

import { useState } from "react"
import { useCases } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileText, AlertTriangle, CheckCircle, Bell } from "lucide-react"
import CreateCaseDialog from "./CreateCaseDialog"
import CaseList from "./CaseList"
import InquiryPanel from "./InquiryPanel"
import AdminNotifications from "./AdminNotifications"

export default function AdminDashboard() {
  const [showCreateCase, setShowCreateCase] = useState(false)
  const { cases, getUnreadNotificationCount } = useCases()

  const openCases = cases.filter((c) => c.status === "open").length
  const investigatingCases = cases.filter((c) => c.status === "investigating").length
  const closedCases = cases.filter((c) => c.status === "closed").length
  const totalEvidence = cases.reduce((acc, c) => acc + c.evidence.length, 0)
  const unreadCount = getUnreadNotificationCount()
  const casesRequiringVerification = cases.filter((c) => c.requiresVerification).length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3E2723]">{cases.length}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C9A227]" />
              Investigating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A227]">{investigatingCases}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              Closed Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{closedCases}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37]">Total Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3E2723]">{totalEvidence}</div>
          </CardContent>
        </Card>

        <Card className="police-card border-2 border-[#C9A227]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8B0000]" />
              New Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8B0000]">{unreadCount}</div>
            <p className="text-xs text-[#5D4E37] mt-1">Unread submissions</p>
          </CardContent>
        </Card>
      </div>

      {casesRequiringVerification > 0 && (
        <Card className="police-card border-4 border-[#8B0000] bg-[#FFF3CD]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-[#8B0000]" />
                <div>
                  <p className="font-bold text-[#8B0000] text-lg">
                    {casesRequiringVerification} Case{casesRequiringVerification > 1 ? "s" : ""} Require Verification
                  </p>
                  <p className="text-sm text-[#856404]">
                    Multiple officers claiming high contribution percentages detected
                  </p>
                </div>
              </div>
              <Button className="bg-[#8B0000] hover:bg-[#6B0000] text-white">Review Now</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="cases" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-[#C2B280]">
            <TabsTrigger value="cases" className="data-[state=active]:bg-[#C9A227]">
              Cases
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#C9A227] relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-[#8B0000] text-white px-2 py-0 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inquiry" className="data-[state=active]:bg-[#C9A227]">
              Inquiry Panel
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setShowCreateCase(true)} className="bg-[#8B7355] hover:bg-[#6D5A43] text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Case
          </Button>
        </div>

        <TabsContent value="cases" className="space-y-4">
          <CaseList isAdmin={true} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <AdminNotifications />
        </TabsContent>

        <TabsContent value="inquiry" className="space-y-4">
          <InquiryPanel />
        </TabsContent>
      </Tabs>

      <CreateCaseDialog open={showCreateCase} onOpenChange={setShowCreateCase} />
    </div>
  )
}
