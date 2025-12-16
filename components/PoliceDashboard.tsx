"use client"

import { useAuth } from "@/context/AuthContext"
import { useCases } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, Star, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CaseList from "./CaseList"
import MySubmissions from "./MySubmissions"

export default function PoliceDashboard() {
  const { user } = useAuth()
  const { cases } = useCases()

  const myCases = user?.district ? cases.filter((c) => c.district === user.district) : []

  const mySubmissions = cases.reduce((acc, c) => {
    const submissions = c.evidence.filter((e) => e.officerId === user?.id)
    return acc + submissions.length
  }, 0)

  const genuineSubmissions = cases.reduce((acc, c) => {
    const genuine = c.evidence.filter((e) => e.officerId === user?.id && e.status === "genuine")
    return acc + genuine.length
  }, 0)

  return (
    <div className="space-y-6">
      <Card className="police-card border-2 border-[#C9A227] bg-gradient-to-r from-[#F5F1E8] to-[#E8DDB5]">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#3E2723]" />
            </div>
            <div>
              <p className="text-sm text-[#5D4E37] font-semibold">Your Assigned District</p>
              <p className="text-2xl font-bold text-[#3E2723]">{user?.district}</p>
              <p className="text-xs text-[#5D4E37] mt-1">
                You have full access to {myCases.length} case{myCases.length !== 1 ? "s" : ""} in your district
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My District Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3E2723]">{myCases.length}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              My Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A227]">{mySubmissions}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              Verified Genuine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{genuineSubmissions}</div>
          </CardContent>
        </Card>

        <Card className="police-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5D4E37] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A227]" fill="#C9A227" />
              Merit Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A227]">{user?.points || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList className="bg-[#C2B280]">
          <TabsTrigger value="cases" className="data-[state=active]:bg-[#C9A227]">
            All Cases
          </TabsTrigger>
          <TabsTrigger value="submissions" className="data-[state=active]:bg-[#C9A227]">
            My Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <CaseList isAdmin={false} />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <MySubmissions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
