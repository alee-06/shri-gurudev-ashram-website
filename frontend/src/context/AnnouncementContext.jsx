import { createContext, useContext, useState, useEffect } from "react";
import { announcements } from "../data/dummyData";

const AnnouncementContext = createContext();

// Helper to migrate existing announcements data to new format
// Use the first announcement as the default, or create a default one
const getInitialAnnouncement = () => {
  if (announcements && announcements.length > 0) {
    return {
      message: announcements[0].text || "",
      active: true,
      priority: 1
    };
  }
  return {
    message: "",
    active: false,
    priority: 1
  };
};

export const AnnouncementProvider = ({ children }) => {
  const [announcement, setAnnouncement] = useState(() => {
    // Initialize with migrated data
    const saved = localStorage.getItem("announcement");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getInitialAnnouncement();
      }
    }
    return getInitialAnnouncement();
  });

  // Save to localStorage whenever announcement changes
  useEffect(() => {
    localStorage.setItem("announcement", JSON.stringify(announcement));
  }, [announcement]);

  const updateAnnouncement = (updates) => {
    setAnnouncement(prev => ({ ...prev, ...updates }));
  };

  const value = {
    announcement,
    updateAnnouncement
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncement = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error("useAnnouncement must be used within AnnouncementProvider");
  }
  return context;
};
