"use client";

import { BarChart3, Package, Settings, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function StoreDisplay() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Products</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">24</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Customers</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">12</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$1,234</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Store Status</span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-500">Active</span>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="products">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Products Management</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your store&apos;s products here.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="customers">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Customer Management</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your store&apos;s customers here.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Store Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your store&apos;s settings here.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}