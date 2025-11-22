"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CreditCard, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="size-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="size-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <div className="mt-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                  John Doe
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <div className="mt-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                  john@example.com
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <p className="text-sm font-medium text-zinc-300">Current Plan</p>
                <p className="text-2xl font-bold text-white mt-1">Pro Plan</p>
                <p className="text-sm text-zinc-400 mt-1">$29/month</p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <p className="text-sm font-medium text-zinc-300 mb-2">Production Key</p>
                <code className="text-xs text-zinc-500 font-mono">sk_prod_••••••••••••••••</code>
              </div>
              <Button>Generate New Key</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
