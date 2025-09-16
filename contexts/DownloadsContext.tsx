"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DownloadData {
  file: string;
  size: string;
  count: number;
  last: string;
}

interface DownloadsContextType {
  downloads: DownloadData[];
  recordDownload: (file: string, size: string) => void;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(
  undefined
);

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (context === undefined) {
    throw new Error("useDownloads must be used within a DownloadsProvider");
  }
  return context;
};

interface DownloadsProviderProps {
  children: ReactNode;
}

export const DownloadsProvider: React.FC<DownloadsProviderProps> = ({
  children,
}) => {
  const [downloads, setDownloads] = useState<DownloadData[]>(() => {
    const storedDownloads = localStorage.getItem("nisirDownloads");
    if (storedDownloads) {
      try {
        const parsedDownloads = JSON.parse(storedDownloads);
        return Array.isArray(parsedDownloads) ? parsedDownloads : [];
      } catch (error) {
        console.error("Failed to parse stored downloads:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("nisirDownloads", JSON.stringify(downloads));
  }, [downloads]);

  const recordDownload = (file: string, size: string) => {
    const now = new Date();
    const last = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    setDownloads((prevDownloads) => {
      const existingDownload = prevDownloads.find((d) => d.file === file);
      if (existingDownload) {
        return prevDownloads.map((d) =>
          d.file === file ? { ...d, count: d.count + 1, last } : d
        );
      } else {
        return [...prevDownloads, { file, size, count: 1, last }];
      }
    });
  };

  return (
    <DownloadsContext.Provider value={{ downloads, recordDownload }}>
      {children}
    </DownloadsContext.Provider>
  );
};
