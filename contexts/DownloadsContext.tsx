// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";

// interface DownloadData {
//   file: string;
//   size: string;
//   count: number;
//   last: string;
// }

// interface DownloadsContextType {
//   downloads: DownloadData[];
//   recordDownload: (file: string, size: string) => void;
// }

// const DownloadsContext = createContext<DownloadsContextType | undefined>(
//   undefined
// );

// export const useDownloads = () => {
//   const context = useContext(DownloadsContext);
//   if (context === undefined) {
//     throw new Error("useDownloads must be used within a DownloadsProvider");
//   }
//   return context;
// };

// interface DownloadsProviderProps {
//   children: ReactNode;
// }

// export const DownloadsProvider: React.FC<DownloadsProviderProps> = ({
//   children,
// }) => {
//   const [downloads, setDownloads] = useState<DownloadData[]>([]);

//   useEffect(() => {
//     try {
//       const stored =
//         typeof window !== "undefined"
//           ? localStorage.getItem("nisirDownloads")
//           : null;
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) setDownloads(parsed);
//       }
//     } catch (error) {
//       console.error("Failed to parse stored downloads:", error);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       if (typeof window !== "undefined") {
//         localStorage.setItem("nisirDownloads", JSON.stringify(downloads));
//       }
//     } catch {}
//   }, [downloads]);

//   const recordDownload = (file: string, size: string) => {
//     const now = new Date();
//     const last = now.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//     setDownloads((prevDownloads) => {
//       const existingDownload = prevDownloads.find((d) => d.file === file);
//       if (existingDownload) {
//         return prevDownloads.map((d) =>
//           d.file === file ? { ...d, count: d.count + 1, last } : d
//         );
//       } else {
//         return [...prevDownloads, { file, size, count: 1, last }];
//       }
//     });
//   };

//   return (
//     <DownloadsContext.Provider value={{ downloads, recordDownload }}>
//       {children}
//     </DownloadsContext.Provider>
//   );
// };
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
  const [downloads, setDownloads] = useState<DownloadData[]>([]);

  // Load downloads from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nisirDownloads");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            console.log("Loaded downloads from localStorage:", parsed); // Debug
            setDownloads(parsed);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load downloads from localStorage:", error);
    }
  }, []);

  // Save downloads to localStorage when they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && downloads.length > 0) {
        console.log("Saving downloads to localStorage:", downloads); // Debug
        localStorage.setItem("nisirDownloads", JSON.stringify(downloads));
      }
    } catch (error) {
      console.error("Failed to save downloads to localStorage:", error);
    }
  }, [downloads]);

  const recordDownload = (file: string, size: string) => {
    console.log(`Recording download: ${file}, ${size}`); // Debug
    const now = new Date();
    const last = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setDownloads((prevDownloads) => {
      const newDownloads = [...prevDownloads];
      const existingIndex = newDownloads.findIndex((d) => d.file === file);

      if (existingIndex !== -1) {
        newDownloads[existingIndex] = {
          ...newDownloads[existingIndex],
          count: newDownloads[existingIndex].count + 1,
          last,
        };
      } else {
        newDownloads.push({ file, size, count: 1, last });
      }

      console.log("Updated downloads:", newDownloads); // Debug
      return newDownloads;
    });
  };

  return (
    <DownloadsContext.Provider value={{ downloads, recordDownload }}>
      {children}
    </DownloadsContext.Provider>
  );
};