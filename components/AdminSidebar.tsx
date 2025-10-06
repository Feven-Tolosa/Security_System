"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_ITEMS = [
  {
    key: "admin_dashboard",
    href: "/Admin",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    key: "admin_requests",
    href: "/Admin/requests",
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  },
  {
    key: "admin_downloads",
    href: "/Admin/downloads",
    icon: <ArrowDownTrayIcon className="h-6 w-6" />,
  },
  {
    key: "admin_reports",
    href: "/Admin/reports",
    icon: <ChartBarIcon className="h-6 w-6" />,
  },
  {
    key: "admin_settings_nav",
    href: "/Admin/settings",
    icon: <Cog6ToothIcon className="h-6 w-6" />,
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className={`flex flex-col h-auto bg-gray-900 text-white transition-width duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2 border-b border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-700"
        >
          {collapsed ? "➤" : "⇐"}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {item.icon}
            {!collapsed && <span className="font-medium">{t(item.key)}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
