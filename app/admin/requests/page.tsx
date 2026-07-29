
"use client";

import { useState, useEffect } from "react";
import { useRequests, type RequestData } from "@/contexts/RequestsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RequestsPage() {
  const { requests, updateRequestStatus } = useRequests();
  const { t } = useLanguage();
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    console.log("Requests updated:", requests);
  }, [requests]);

  const handleStatusUpdate = (
    id: string,
    status: "Approved" | "Rejected" | "Pending"
  ) => {
    if (!updateRequestStatus) return;
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    updateRequestStatus(id, status);

    setStatusUpdateMessage({
      type: status.toLowerCase(),
      message: `Request ${status.toLowerCase()} successfully!`,
    });

    setTimeout(() => {
      setStatusUpdateMessage(null);
    }, 3000);
  };

  const filteredRequests =
    filterStatus === "All"
      ? requests
      : requests.filter((request) => request.status === filterStatus);

  // Button styles
  const getButtonStyle = (
    type: "approve" | "reject" | "pending" | "details"
  ) => {
    const base =
      "px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all shadow-md";
    switch (type) {
      case "approve":
        return `${base} bg-green-600 hover:bg-green-700 text-white`;
      case "reject":
        return `${base} bg-red-600 hover:bg-red-700 text-white`;
      case "pending":
        return `${base} bg-yellow-500 hover:bg-yellow-600 text-white`;
      case "details":
        return `${base} bg-blue-600 hover:bg-blue-700 text-white`;
      default:
        return base;
    }
  };

  const getFilterButtonStyle = (status: string) => {
    const isActive = filterStatus === status;
    const base =
      "px-3 py-1.5 rounded-md text-sm font-medium transition-all border";
    return isActive
      ? `${base} bg-blue-600 text-white border-blue-500`
      : `${base} bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600`;
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">
        {t("security_requests_dashboard")}
      </h1>

      {/* Status message */}
      {statusUpdateMessage && (
        <div
          className={`mb-6 p-3 rounded-lg text-center font-semibold ${
            statusUpdateMessage.type === "approved"
              ? "bg-green-900/40 text-green-300"
              : statusUpdateMessage.type === "rejected"
              ? "bg-red-900/40 text-red-300"
              : "bg-yellow-900/40 text-yellow-300"
          }`}
        >
          {statusUpdateMessage.message}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setFilterStatus(
                status as "All" | "Pending" | "Approved" | "Rejected"
              )
            }
            className={getFilterButtonStyle(status)}
          >
            {status} (
            {status === "All"
              ? requests.length
              : requests.filter((r) => r.status === status).length}
            )
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-800/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-700/40"
            >
              {/* Left: ID */}
              <div className="text-blue-400 font-semibold mb-2 sm:mb-0">
                #{request.id}
              </div>

              {/* Middle: Info */}
              <div className="flex-1 text-sm text-gray-300 space-y-1 mb-3 sm:mb-0 sm:mx-4">
                <div className="font-medium">{request.fullName}</div>
                <div className="text-gray-400">{request.email}</div>
                <div className="text-gray-400">{request.company}</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{t("status_label")}:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      request.status === "Approved"
                        ? "bg-green-900/40 text-green-300"
                        : request.status === "Rejected"
                        ? "bg-red-900/40 text-red-300"
                        : "bg-yellow-900/40 text-yellow-300 animate-pulse"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex gap-2 flex-wrap justify-end">
                {request.status !== "Approved" && (
                  <button
                    onClick={() => handleStatusUpdate(request.id, "Approved")}
                    className={getButtonStyle("approve")}
                  >
                    {t("btn_approve")}
                  </button>
                )}
                {request.status !== "Rejected" && (
                  <button
                    onClick={() => handleStatusUpdate(request.id, "Rejected")}
                    className={getButtonStyle("reject")}
                  >
                    {t("btn_reject")}
                  </button>
                )}
                {(request.status === "Approved" ||
                  request.status === "Rejected") && (
                  <button
                    onClick={() => handleStatusUpdate(request.id, "Pending")}
                    className={getButtonStyle("pending")}
                  >
                    {t("btn_pending")}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRequest(request)}
                  className={getButtonStyle("details")}
                >
                  {t("btn_details")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            {t("no_requests_found")}
          </div>
        )}
      </div>

      {/* Modal for details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700/50 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {t("request_details")}
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <DetailItem label={t("label_id")} value={selectedRequest.id} />
              <DetailItem
                label={t("label_name")}
                value={selectedRequest.fullName}
              />
              <DetailItem
                label={t("label_email")}
                value={selectedRequest.email}
              />
              <DetailItem
                label={t("label_company")}
                value={selectedRequest.company}
              />
              <DetailItem
                label={t("label_type")}
                value={selectedRequest.type}
              />
              <DetailItem
                label={t("label_date")}
                value={selectedRequest.date}
              />
              <DetailItem
                label={t("message_label")}
                value={selectedRequest.message || "No message"}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                {t("btn_close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex justify-between border-b border-gray-700/30 py-1">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-200">{value}</span>
  </div>
);
