import { useState } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Activity, Settings } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your Coinbase integration and account settings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-bg border-border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Connected</div>
              <Badge className="bg-accent-green/20 text-accent-green mt-2">
                Active
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">25</div>
              <p className="text-xs text-gray-400 mt-2">Available for use</p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-gray-400 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card-bg border-border-primary">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">Credit Purchase</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                  <Badge className="bg-accent-green/20 text-accent-green">
                    +10 Credits
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">Wallet Connection</p>
                    <p className="text-sm text-gray-400">Yesterday</p>
                  </div>
                  <Badge className="bg-accent-blue/20 text-accent-blue">
                    Connected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader>
              <CardTitle className="text-white">Coinbase Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">OAuth Status</span>
                  <Badge className="bg-accent-green/20 text-accent-green">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">CDP Integration</span>
                  <Badge className="bg-accent-blue/20 text-accent-blue">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Payment Methods</span>
                  <Badge className="bg-accent-purple/20 text-accent-purple">2 Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}