import React, { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Home,
  Briefcase
} from "lucide-react";
import { getDashboardStats } from "../api/Dashboard";

const statsConfig = [
  {
    key: "totalConstituents",
    label: "Constituents",
    icon: Users,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    key: "totalMandals",
    label: "Mandals",
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    key: "totalVillages",
    label: "Villages",
    icon: Home,
    gradient: "from-orange-500 to-amber-600",
  },
  {
    key: "totalWorks",
    label: "Works",
    icon: Briefcase,
    gradient: "from-pink-500 to-rose-600",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Quick insights into your system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="relative overflow-hidden rounded-2xl shadow-lg bg-white"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-90`}
              />

              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">
                      {item.label}
                    </p>
                    <h2 className="text-4xl font-bold mt-2">
                      {stats?.[item.key] ?? 0}
                    </h2>
                  </div>

                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional section */}
      <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Summary
        </h2>
        <p className="text-gray-600 text-sm">
          This dashboard gives you a high-level view of all
          administrative units and active works in the system.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
