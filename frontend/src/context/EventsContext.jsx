import { createContext, useContext, useState, useEffect } from "react";
import { events } from "../data/dummyData";

const EventsContext = createContext();

// Helper to migrate existing events data to new format
const migrateEventsData = () => {
  return events.map((event, index) => ({
    id: event.id || index + 1,
    title: event.title || "Untitled Event",
    description: event.description || "",
    date: event.date || new Date().toISOString().split('T')[0],
    imageUrl: event.image || "",
    visible: true,
    order: index + 1,
    // Preserve additional fields for compatibility
    time: event.time || "",
    location: event.location || ""
  }));
};

export const EventsProvider = ({ children }) => {
  const [eventsItems, setEventsItems] = useState(() => {
    // Initialize with migrated data
    const saved = localStorage.getItem("eventsItems");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return migrateEventsData();
      }
    }
    return migrateEventsData();
  });

  // Save to localStorage whenever eventsItems change
  useEffect(() => {
    localStorage.setItem("eventsItems", JSON.stringify(eventsItems));
  }, [eventsItems]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(), // Simple ID generation
      order: eventsItems.length + 1,
      visible: event.visible !== undefined ? event.visible : true,
      time: event.time || "",
      location: event.location || ""
    };
    setEventsItems([...eventsItems, newEvent]);
  };

  const updateEvent = (id, updates) => {
    setEventsItems(eventsItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteEvent = (id) => {
    setEventsItems(eventsItems.filter(item => item.id !== id));
  };

  const toggleVisibility = (id) => {
    setEventsItems(eventsItems.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const moveEvent = (id, direction) => {
    const items = [...eventsItems];
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
    
    setEventsItems(items);
  };

  // Get visible events sorted by order (for public events page)
  const getVisibleEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventsItems
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => {
        const eventDate = new Date(item.date);
        eventDate.setHours(0, 0, 0, 0);
        const isUpcoming = eventDate >= today;
        
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          time: item.time,
          location: item.location,
          image: item.imageUrl, // Map imageUrl to image for EventCard compatibility
          status: isUpcoming ? "upcoming" : "past"
        };
      });
  };

  const value = {
    eventsItems,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleVisibility,
    moveEvent,
    getVisibleEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return context;
};
