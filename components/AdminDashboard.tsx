"use client";

import React, { useState, useEffect } from "react";
import {
  UserIcon,
  CloudArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRequests } from "@/contexts/RequestsContext";
import { useDownloads } from "@/contexts/DownloadsContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock useUsers hook (replace with real API/context)
const useUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      // Replace with actual API call, e.g., fetch('/api/users').then(res => res.json())
      const mockUsers = 300; // Mock data
      setTotalUsers(mockUsers);
    };
    fetchUsers();
  }, []);
  return totalUsers;
};

const AdminDashboard = () => {
  const { requests } = useRequests();
  const { downloads } = useDownloads();
  const totalUsers = useUsers();
  const { t } = useLanguage();

  // State for activity log
  const [activityLog, setActivityLog] = useState(() => {
    const storedLog = localStorage.getItem("nisirActivityLog");
    if (storedLog) {
      try {
        const parsedLog = JSON.parse(storedLog);
        return Array.isArray(parsedLog) ? parsedLog : [];
      } catch (error) {
        console.error("Failed to parse activity log:", error);
        return [];
      }
    }
    return [];
  });

  // Filter pending requests
  const pendingRequests = requests.filter((req) => req.status === "Pending");

  // Calculate total downloads
  const totalDownloads = downloads.reduce((sum, d) => sum + d.count, 0);

  // Initial activity log with new entry
  useEffect(() => {
    const now = new Date();
    const time =
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " EAT";
    if (activityLog.length === 0) {
      setActivityLog([
        {
          id: Date.now(),
          message: "System health check completed",
          time,
          type: "info",
        },
      ]);
    }
  }, [activityLog.length]);

  // Persist activity log to localStorage
  useEffect(() => {
    localStorage.setItem("nisirActivityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  return (
    <>
      <main className="pt-12 pb-16 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary">
            {t("admin_dashboard_title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("admin_dashboard_subtitle")}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
            <UserIcon className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-medium text-gray-400 mt-3">
              {t("admin_total_users")}
            </h3>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
            <CloudArrowDownIcon className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-medium text-gray-400 mt-3">
              {t("admin_app_downloads")}
            </h3>
            <p className="text-3xl font-bold text-white">{totalDownloads}</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
            <UserIcon className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-medium text-gray-400 mt-3">
              {t("admin_pending_requests")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {pendingRequests.length}
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <section className="bg-white/10 dark:bg-gray-900/60 p-6 rounded-2xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            {t("admin_user_requests")}
          </h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-400">{t("admin_no_pending_requests")} 🎉</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between bg-gray-800/40 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-white">{req.fullName}</p>
                    <p className="text-sm text-gray-400">{req.email}</p>
                  </div>
                  {/* Removed Approve/Deny buttons */}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity Logs */}
        <section className="bg-white/10 dark:bg-gray-900/60 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            {t("admin_recent_activity")}
          </h2>
          <div className="space-y-3">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-xl"
              >
                {log.type === "success" && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
                {log.type === "error" && (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
                {log.type === "info" && (
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {log.type === "info" && (
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {log.message}
                  </p>
                  <p className="text-xs text-gray-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;
