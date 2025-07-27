"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import {
  Bell,
  User,
  Lock,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Activity,
  Shield,
} from "lucide-react"

interface UserSettings {
  email: string
  notifications: {
    email: boolean
    push: boolean
    challenges: boolean
    messages: boolean
  }
  preferences: {
    theme: string
    language: string
    units: string
  }
  privacy: {
    profileVisibility: string
    activitySharing: boolean
    showProgress: boolean
  }
  wearables: {
    fitbit: boolean
    appleHealth: boolean
    googleFit: boolean
  }
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  
  const [settings, setSettings] = useState<UserSettings>({
    email: "user@example.com",
    notifications: {
      email: true,
      push: true,
      challenges: true,
      messages: true,
    },
    preferences: {
      theme: theme || "dark",
      language: "en",
      units: "metric",
    },
    privacy: {
      profileVisibility: "public",
      activitySharing: true,
      showProgress: true,
    },
    wearables: {
      fitbit: false,
      appleHealth: false,
      googleFit: false,
    },
  })

  const handleSaveSettings = () => {
    toast.success("Profile updated", {
        description: "Your profile information has been successfully updated.",
      })
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Account Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="challenge-notifications">Challenge Updates</Label>
                <Switch
                  id="challenge-notifications"
                  checked={settings.notifications.challenges}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        challenges: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="message-notifications">Message Notifications</Label>
                <Switch
                  id="message-notifications"
                  checked={settings.notifications.messages}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        messages: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: value },
                      })
                      setTheme(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="mr-2 h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="mr-2 h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Units</Label>
                <Select
                  value={settings.preferences.units}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, units: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, km)</SelectItem>
                    <SelectItem value="imperial">Imperial (lb, mi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="activity-sharing">Activity Sharing</Label>
                <Switch
                  id="activity-sharing"
                  checked={settings.privacy.activitySharing}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, activitySharing: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress">Show Progress</Label>
                <Switch
                  id="show-progress"
                  checked={settings.privacy.showProgress}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showProgress: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <CardTitle>Connected Devices</CardTitle>
              </div>
              <CardDescription>
                Connect your fitness tracking devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <Label>Fitbit</Label>
                </div>
                <Switch
                  checked={settings.wearables.fitbit}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      wearables: { ...settings.wearables, fitbit: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <Label>Apple Health</Label>
                </div>
                <Switch
                  checked={settings.wearables.appleHealth}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      wearables: { ...settings.wearables, appleHealth: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <Label>Google Fit</Label>
                </div>
                <Switch
                  checked={settings.wearables.googleFit}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      wearables: { ...settings.wearables, googleFit: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
