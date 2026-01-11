import { createContext, useContext, useState, useEffect } from "react";
import { galleryImages } from "../data/dummyData";
import { brochureGalleryImages } from "../data/brochureData";

const GalleryContext = createContext();

// Helper to migrate existing gallery data to new format
const migrateGalleryData = () => {
  // Use brochureGalleryImages if available, otherwise use galleryImages
  const sourceImages = brochureGalleryImages.length > 0 
    ? brochureGalleryImages 
    : galleryImages;
  
  return sourceImages.map((img, index) => ({
    id: img.id || index + 1,
    title: img.title || "Untitled",
    category: img.category || "general",
    imageUrl: img.src || img.imageUrl || "",
    visible: true,
    order: index + 1
  }));
};

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState(() => {
    // Initialize with migrated data
    const saved = localStorage.getItem("galleryItems");
    let currentItems = [];
    
    if (saved) {
      try {
        currentItems = JSON.parse(saved);
      } catch (e) {
        currentItems = migrateGalleryData();
      }
    } else {
      currentItems = migrateGalleryData();
    }
    
    // Sync: Ensure all brochure images are present (add missing ones)
    const brochureImageUrls = new Set(brochureGalleryImages.map(img => img.src));
    const existingImageUrls = new Set(currentItems.map(item => item.imageUrl));
    
    // Find missing images
    const missingImages = brochureGalleryImages.filter(img => !existingImageUrls.has(img.src));
    
    if (missingImages.length > 0) {
      // Add missing images
      const newItems = missingImages.map((img, index) => ({
        id: Date.now() + index, // Temporary ID, will be unique
        title: img.title || "Untitled",
        category: img.category || "general",
        imageUrl: img.src,
        visible: true,
        order: currentItems.length + index + 1
      }));
      
      currentItems = [...currentItems, ...newItems];
    }
    
    return currentItems;
  });

  // Save to localStorage whenever galleryItems change
  useEffect(() => {
    localStorage.setItem("galleryItems", JSON.stringify(galleryItems));
  }, [galleryItems]);

  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(), // Simple ID generation
      order: galleryItems.length + 1,
      visible: item.visible !== undefined ? item.visible : true
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const updateGalleryItem = (id, updates) => {
    setGalleryItems(galleryItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteGalleryItem = (id) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const toggleVisibility = (id) => {
    setGalleryItems(galleryItems.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const moveItem = (id, direction) => {
    const items = [...galleryItems];
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
    
    setGalleryItems(items);
  };

  // Get visible items sorted by order (for public gallery)
  const getVisibleItems = () => {
    return galleryItems
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        id: item.id,
        src: item.imageUrl,
        title: item.title,
        category: item.category
      }));
  };

  // Get all unique categories
  const getCategories = () => {
    const categories = new Set(galleryItems.map(item => item.category));
    return Array.from(categories).filter(Boolean);
  };

  const value = {
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleVisibility,
    moveItem,
    getVisibleItems,
    getCategories
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within GalleryProvider");
  }
  return context;
};
