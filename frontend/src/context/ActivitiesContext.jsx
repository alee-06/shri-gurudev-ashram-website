import { createContext, useContext, useState, useEffect } from "react";
import { activities } from "../data/dummyData";

const ActivitiesContext = createContext();

// Helper to migrate existing activities data to new format
const migrateActivitiesData = () => {
  return activities.map((activity, index) => ({
    id: activity.id || index + 1,
    title: activity.title || "Untitled Activity",
    shortDescription: activity.description || "",
    imageUrl: activity.image || "",
    visible: true,
    order: index + 1,
    // Preserve additional fields for compatibility
    category: activity.category || "spiritual",
    icon: activity.icon || "",
    subitems: activity.subitems || []
  }));
};

export const ActivitiesProvider = ({ children }) => {
  const [activitiesItems, setActivitiesItems] = useState(() => {
    // Initialize with migrated data
    const saved = localStorage.getItem("activitiesItems");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return migrateActivitiesData();
      }
    }
    return migrateActivitiesData();
  });

  // Save to localStorage whenever activitiesItems change
  useEffect(() => {
    localStorage.setItem("activitiesItems", JSON.stringify(activitiesItems));
  }, [activitiesItems]);

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now(), // Simple ID generation
      order: activitiesItems.length + 1,
      visible: activity.visible !== undefined ? activity.visible : true,
      category: activity.category || "spiritual",
      icon: activity.icon || "",
      subitems: activity.subitems || []
    };
    setActivitiesItems([...activitiesItems, newActivity]);
  };

  const updateActivity = (id, updates) => {
    setActivitiesItems(activitiesItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteActivity = (id) => {
    setActivitiesItems(activitiesItems.filter(item => item.id !== id));
  };

  const toggleVisibility = (id) => {
    setActivitiesItems(activitiesItems.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const moveActivity = (id, direction) => {
    const items = [...activitiesItems];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === "down" && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    
    // Update order numbers
    items.forEach((item, idx) => {
      item.order = idx + 1;
    });
    
    setActivitiesItems(items);
  };

  // Get visible activities sorted by order (for public activities page)
  const getVisibleActivities = () => {
    return activitiesItems
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        id: item.id,
        title: item.title,
        description: item.shortDescription, // Map shortDescription to description for ProgramCard compatibility
        image: item.imageUrl, // Map imageUrl to image for ProgramCard compatibility
        icon: item.icon,
        category: item.category,
        subitems: item.subitems
      }));
  };

  // Get all unique categories
  const getCategories = () => {
    const categories = new Set(activitiesItems.map(item => item.category));
    return Array.from(categories).filter(Boolean);
  };

  const value = {
    activitiesItems,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleVisibility,
    moveActivity,
    getVisibleActivities,
    getCategories
  };

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error("useActivities must be used within ActivitiesProvider");
  }
  return context;
};
