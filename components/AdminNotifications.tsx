"use client"

import { useCases } from "@/context/CaseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock } from "lucide-react"

export default function AdminNotifications() {
  const { adminNotifications, markNotificationRead } = useCases()

  const handleMarkRead = (notificationId: string) => {
    markNotificationRead(notificationId)
  }

  return (
    <div className="space-y-4">
      <Card className="police-card">
        <CardHeader className="bg-[#C2B280]">
          <CardTitle className="text-xl text-[#3E2723] flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Evidence Submission Notifications
          </CardTitle>
          <p className="text-sm text-[#5D4E37] mt-2">Real-time alerts when officers submit evidence</p>
        </CardHeader>
        <CardContent className="pt-6">
          {adminNotifications.length === 0 ? (
            <div className="text-center py-12 text-[#5D4E37]">
              <Bell className="w-16 h-16 mx-auto mb-4 text-[#C9A227]" />
              <p>No evidence submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adminNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${notification.read ? "bg-[#F5F1E8]" : "bg-[#FFF3CD] border-2 border-[#C9A227]"}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!notification.read && <Badge className="bg-[#8B0000] text-white">NEW</Badge>}
                          <span className="font-bold text-[#3E2723]">{notification.officerName}</span>
                          <Badge variant="outline" className="text-xs">
                            Contribution: {notification.contributionPercentage}%
                          </Badge>
                        </div>

                        <p className="text-sm text-[#5D4E37] mb-1">
                          Submitted evidence for:{" "}
                          <span className="font-semibold text-[#3E2723]">{notification.caseTitle}</span>
                        </p>

                        <div className="flex items-center gap-2 text-xs text-[#5D4E37] mt-2">
                          <Clock className="w-3 h-3" />
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkRead(notification.id)}
                            className="bg-[#8B7355] hover:bg-[#6D5A43] text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-[#C9A227] bg-transparent">
                          Review & Assign Points
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
