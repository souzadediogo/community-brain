"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Check, MessageSquare, Sparkles, UserPlus, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "reply" | "mention" | "ai_response" | "upvote" | "follow"
  title: string
  message: string
  user?: {
    name: string
    avatar: string
  }
  threadId?: string
  createdAt: Date
  read: boolean
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reply",
      title: "New reply to your question",
      message: "Sarah Chen replied to 'How to scale from 100 to 1000 customers?'",
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      threadId: "1",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "2",
      type: "ai_response",
      title: "Braintrust AI answered your question",
      message: "AI has generated a comprehensive answer to your question",
      threadId: "1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
    {
      id: "3",
      type: "upvote",
      title: "Your answer was upvoted",
      message: "Michael Rodriguez upvoted your answer",
      user: {
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      threadId: "2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    },
    {
      id: "4",
      type: "mention",
      title: "You were mentioned",
      message: "Emily Watson mentioned you in a thread",
      user: {
        name: "Emily Watson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      threadId: "3",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "reply":
        return <MessageSquare className="h-4 w-4" />
      case "ai_response":
        return <Sparkles className="h-4 w-4" />
      case "upvote":
        return <ThumbsUp className="h-4 w-4" />
      case "mention":
        return <MessageSquare className="h-4 w-4" />
      case "follow":
        return <UserPlus className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:bg-transparent"
              onClick={markAllAsRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.threadId ? `/threads/${notification.threadId}` : "#"}
                  className={`block p-4 hover:bg-accent transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {notification.user ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={notification.user.avatar || "/placeholder.svg"}
                            alt={notification.user.name}
                          />
                          <AvatarFallback>
                            {notification.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{notification.title}</p>
                        {!notification.read && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-1" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
