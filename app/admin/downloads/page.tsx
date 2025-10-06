"use client";

import React from "react";
import { useDownloads } from "@/contexts/DownloadsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DownloadsPage() {
  const { downloads } = useDownloads();
  const { t } = useLanguage();

  return (
    <div className="p-4 sm:p-6 mb-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        {t("admin_downloads_title")}
      </h1>
      <div className="overflow-x-auto bg-gray-400 rounded-xl">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 text-white text-left">
            <tr>
              <th className="px-3 py-2 text-sm sm:text-base">
                {t("table_file")}
              </th>
              <th className="px-3 py-2 text-sm sm:text-base">
                {t("table_size")}
              </th>
              <th className="px-3 py-2 text-sm sm:text-base">
                {t("table_downloads")}
              </th>
              <th className="px-3 py-2 text-sm sm:text-base">
                {t("table_last_download")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {downloads.length > 0 ? (
              downloads.map((d, i) => (
                <tr key={i} className="hover:bg-gray-300">
                  <td className="px-3 py-2">{d.file}</td>
                  <td className="px-3 py-2">{d.size}</td>
                  <td className="px-3 py-2">{d.count}</td>
                  <td className="px-3 py-2">{d.last}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                  {t("table_empty_downloads")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <button className="mt-4 bg-primary px-4 py-2 rounded">
        Upload New File
      </button> */}
    </div>
  );
}
