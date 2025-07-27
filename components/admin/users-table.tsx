"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { UserIcon, ShieldAlertIcon, EditIcon, TrashIcon, MoreHorizontal } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  image?: string
}

export function UsersTable() {
  

  const [users, setUsers] = useState<User[]>([
    {
      id: "u1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joinDate: "2023-01-15",
      lastActive: "2023-06-28",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "user",
      status: "active",
      joinDate: "2023-02-22",
      lastActive: "2023-06-30",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u3",
      name: "Michael Brown",
      email: "michael@example.com",
      role: "user",
      status: "suspended",
      joinDate: "2023-03-10",
      lastActive: "2023-06-15",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u4",
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "admin",
      status: "active",
      joinDate: "2022-11-05",
      lastActive: "2023-06-30",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u5",
      name: "David Lee",
      email: "david@example.com",
      role: "user",
      status: "pending",
      joinDate: "2023-06-28",
      lastActive: "2023-06-28",
      image: "/placeholder.svg?height=32&width=32",
    },
  ])

  const handleStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "suspended" : "active"

          toast.info(`User ${newStatus}`, {
            description: `${user.name}'s account has been ${newStatus}.`,
          })

          return {
            ...user,
            status: newStatus,
          }
        }
        return user
      }),
    )
  }

  const handleRoleToggle = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newRole = user.role === "admin" ? "user" : "admin"

          toast.info("Role updated", {
            description: `${user.name} is now a ${newRole}.`,
          })

          return {
            ...user,
            role: newRole as "user" | "admin",
          }
        }
        return user
      }),
    )
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)

    if (user) {
      setUsers(users.filter((u) => u.id !== userId))

      toast.success("User deleted", {
        description: `${user.name}'s account has been deleted.`,
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="hidden md:table-cell">Last Active</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {user.role === "admin" ? (
                    <Badge variant="default" className="bg-amber-500">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={user.status === "active"}
                    onCheckedChange={() => handleStatusToggle(user.id)}
                    disabled={user.status === "pending"}
                  />
                  <span className="capitalize">{user.status}</span>
                </div>
              </TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell className="hidden md:table-cell">{user.lastActive}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.info("View profile", {
                          description: "Viewing user profile (demo).",
                        })
                      }}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleToggle(user.id)}>
                      <ShieldAlertIcon className="mr-2 h-4 w-4" />
                      <span>Toggle Admin</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.info("Edit user", {
                          description: "Editing user details (demo).",
                        })
                      }}
                    >
                      <EditIcon className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

