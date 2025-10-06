// app/Admin/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";
import AdminSidebar from "@/components/AdminSidebar";
import { RequireAuth } from "@/app/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin – Secure Systems",
  description: "Admin dashboard for Secure Systems",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray text-gray-900`}
    >
      <RequireAuth allow={["admin"]}>
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <AdminFooter />
      </RequireAuth>
    </div>
  );
}
