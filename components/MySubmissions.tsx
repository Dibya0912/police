"use client"

import { useAuth } from "@/context/AuthContext"
import { useCases } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Clock, FileText } from "lucide-react"

export default function MySubmissions() {
  const { user } = useAuth()
  const { cases } = useCases()

  const mySubmissions = cases.flatMap((c) =>
    c.evidence.filter((e) => e.officerId === user?.id).map((e) => ({ ...e, caseTitle: c.title })),
  )

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "genuine":
        return <CheckCircle className="w-4 h-4 text-green-700" />
      case "credit-theft":
        return <AlertTriangle className="w-4 h-4 text-[#C9A227]" />
      case "malicious":
        return <XCircle className="w-4 h-4 text-[#8B0000]" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "genuine":
        return "bg-green-700 text-white"
      case "credit-theft":
        return "bg-[#C9A227] text-[#3E2723]"
      case "malicious":
        return "bg-[#8B0000] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-3">
      {mySubmissions.length === 0 ? (
        <Card className="police-card">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[#C9A227]" />
            <p className="text-[#5D4E37]">You haven't submitted any evidence yet</p>
          </CardContent>
        </Card>
      ) : (
        mySubmissions.map((submission) => (
          <Card key={submission.id} className="police-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base text-[#3E2723] mb-1">{submission.caseTitle}</CardTitle>
                  <p className="text-xs text-[#5D4E37]">Submitted: {new Date(submission.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <Badge className={getStatusColor(submission.status)}>{submission.status || "pending"}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-[#3E2723]">Type:</p>
                  <Badge variant="outline" className="text-xs">
                    {submission.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#3E2723]">Description:</p>
                  <p className="text-sm text-[#5D4E37]">{submission.description}</p>
                </div>
                <div className="bg-[#E8DDB5] p-3 rounded">
                  <p className="text-xs font-semibold text-[#3E2723] mb-1">Content:</p>
                  <p className="text-sm text-[#5D4E37]">{submission.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
