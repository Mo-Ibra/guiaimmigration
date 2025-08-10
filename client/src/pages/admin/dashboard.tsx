import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Users,
  MessageSquare,
  CreditCard,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  ChevronUp,
  ChevronDown,
  Eye,
  MoreVertical,
  Bell,
  Search,
  Filter,
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { Link } from "wouter";

interface DashboardStats {
  totalContacts: number;
  totalOrders: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingOrders: number;
  recentContacts: any[];
  recentOrders: any[];
  monthlyRevenue: number[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/dashboard-stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, here's what's happening today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Contacts Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Contacts
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.totalContacts?.toLocaleString() || 0}
                    </p>
                    <div className="flex items-center ml-2 text-green-600">
                      <ChevronUp className="w-3 h-3" />
                      <span className="text-xs font-medium">12%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">vs. last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Orders
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.totalOrders?.toLocaleString() || 0}
                    </p>
                    <div className="flex items-center ml-2 text-green-600">
                      <ChevronUp className="w-3 h-3" />
                      <span className="text-xs font-medium">8%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">vs. last month</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Revenue
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(stats?.paidRevenue || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center ml-2 text-green-600">
                      <ChevronUp className="w-3 h-3" />
                      <span className="text-xs font-medium">15%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">vs. last month</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Orders Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Pending Orders
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.pendingOrders || 0}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    requires attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Contact Messages
                </CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  View all
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {stats?.recentContacts?.slice(0, 5).map((contact, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {contact.firstName?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {contact.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                              {contact.formType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all duration-200">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent contacts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  View all
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {stats?.recentOrders?.slice(0, 5).map((order, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerEmail}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-400">
                              {order.fileType}
                            </span>
                            <span className="text-xs font-medium text-gray-700">
                              ${order.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "in_progress"
                              ? "secondary"
                              : "outline"
                          }
                          className={`text-xs ${
                            order.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.status === "in_progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {order.status?.replace("_", " ") || "pending"}
                        </Badge>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all duration-200">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="p-8 text-center">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/admin/users"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors duration-200">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Manage Users
                </span>
              </Link>

              <Link
                to="/admin/contacts"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors duration-200">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  View Messages
                </span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-amber-100 transition-colors duration-200">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Manage Orders
                </span>
              </Link>

              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors duration-200">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  View Analytics
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
