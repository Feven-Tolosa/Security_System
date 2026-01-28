
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid"; // Add uuid package for unique IDs

export interface RequestData {
  id: string; // Changed to string for UUID
  fullName: string;
  email: string;
  company: string;
  message: string;
  companyName: string;
  totalAgentless: string;
  operatingSystem: string;
  osDetails: string;
  contactName: string;
  contactPhone: string;
  website: string;
  officeNumber: string;
  jobTitle: string;
  department: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

interface RequestsContextType {
  requests: RequestData[];
  addRequest: (
    request: Omit<RequestData, "id" | "status" | "date" | "type"> &
      Partial<Pick<RequestData, "status" | "type">>
  ) => void;
  updateRequestStatus: (
    id: string,
    status: "Pending" | "Approved" | "Rejected"
  ) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
};

interface RequestsProviderProps {
  children: ReactNode;
}

export const RequestsProvider: React.FC<RequestsProviderProps> = ({
  children,
}) => {
  // SSR-safe init; hydrate from localStorage on client
  const [requests, setRequests] = useState<RequestData[]>([]);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("nisirSecurityRequests")
          : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRequests(parsed);
      }
    } catch (error) {
      console.error("Failed to load stored requests:", error);
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("nisirSecurityRequests", JSON.stringify(requests));
      }
    } catch {}
  }, [requests]);

  const addRequest = (
    requestData: Omit<RequestData, "id" | "status" | "date" | "type"> &
      Partial<Pick<RequestData, "status" | "type">>
  ) => {
    const newRequest: RequestData = {
      ...requestData,
      id: uuidv4(), // Use UUID for unique IDs
      status: requestData.status || "Pending", // Allow custom status or default to Pending
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: requestData.type || "SIEM Request", // Allow custom type or default to SIEM Request
    };

    setRequests((prevRequests) => [newRequest, ...prevRequests]);
  };

  const updateRequestStatus = (
    id: string,
    status: "Pending" | "Approved" | "Rejected"
  ) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <RequestsContext.Provider
      value={{ requests, addRequest, updateRequestStatus }}
    >
      {children}
    </RequestsContext.Provider>
  );
};
