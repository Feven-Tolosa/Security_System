// contexts/RequestsContext.tsx
"use client";

<<<<<<< HEAD
import React, { createContext, useContext, useState, ReactNode } from "react";
=======
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
>>>>>>> d7a300d (Local updates before syncing with origin)

export interface RequestData {
  id: number;
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
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  type: string;
}

interface RequestsContextType {
  requests: RequestData[];
  addRequest: (
    request: Omit<RequestData, "id" | "status" | "date" | "type">
  ) => void;
  updateRequestStatus: (
    id: number,
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
  const [requests, setRequests] = useState<RequestData[]>([]);

<<<<<<< HEAD
=======
  // Load requests from localStorage on initial render
  useEffect(() => {
    try {
      const storedRequests = localStorage.getItem("secure-shield-requests");
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      }
    } catch (error) {
      console.error("Failed to load requests from localStorage:", error);
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("secure-shield-requests", JSON.stringify(requests));
    } catch (error) {
      console.error("Failed to save requests to localStorage:", error);
    }
  }, [requests]);

>>>>>>> d7a300d (Local updates before syncing with origin)
  const addRequest = (
    requestData: Omit<RequestData, "id" | "status" | "date" | "type">
  ) => {
    const newRequest: RequestData = {
      ...requestData,
<<<<<<< HEAD
      id: requests.length + 1,
=======
      id: Date.now(), // Use timestamp for unique ID
>>>>>>> d7a300d (Local updates before syncing with origin)
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      type: "SIEM Request",
    };
    setRequests((prev) => [...prev, newRequest]);
  };

  const updateRequestStatus = (
    id: number,
    status: "Pending" | "Approved" | "Rejected"
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
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
