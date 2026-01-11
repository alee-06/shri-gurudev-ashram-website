import { useState } from "react";
import { useActivities } from "../../context/ActivitiesContext";

const ActivitiesManager = () => {
  const {
    activitiesItems,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleVisibility,
    moveActivity
  } = useActivities();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    imageUrl: "",
    visible: true,
    category: "spiritual"
  });

  const sortedItems = [...activitiesItems].sort((a, b) => a.order - b.order);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ 
      title: "", 
      shortDescription: "", 
      imageUrl: "", 
      visible: true,
      category: "spiritual"
    });
    setShowAddForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      shortDescription: item.shortDescription,
      imageUrl: item.imageUrl,
      visible: item.visible,
      category: item.category || "spiritual"
    });
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateActivity(editingItem.id, formData);
    } else {
      addActivity(formData);
    }
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ 
      title: "", 
      shortDescription: "", 
      imageUrl: "", 
      visible: true,
      category: "spiritual"
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ 
      title: "", 
      shortDescription: "", 
      imageUrl: "", 
      visible: true,
      category: "spiritual"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities Manager</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage activities for the public website
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
        >
          + Add Activity
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No activities yet. Click "Add Activity" to get started.
          </div>
        ) : (
          sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${
                      item.visible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.visible ? "Live" : "Hidden"}
                  </span>
                  {item.category && (
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-700 capitalize">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.shortDescription || "No description"}
                </p>
                <p className="text-xs text-gray-500">Order: {item.order}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleVisibility(item.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    item.visible
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.visible ? "Hide" : "Show"}
                </button>

                {/* Move Up */}
                <button
                  onClick={() => moveActivity(item.id, "up")}
                  disabled={index === 0}
                  className="p-2 text-gray-600 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move Up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveActivity(item.id, "down")}
                  disabled={index === sortedItems.length - 1}
                  className="p-2 text-gray-600 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move Down"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${item.title}"?`)) {
                      deleteActivity(item.id);
                    }
                  }}
                  className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? "Edit Activity" : "Add Activity"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter activity title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter short description"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="spiritual">Spiritual</option>
                  <option value="social">Social</option>
                  <option value="charitable">Charitable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) =>
                    setFormData({ ...formData, visible: e.target.checked })
                  }
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="visible" className="ml-2 text-sm text-gray-700">
                  Visible on public website (Live)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
                >
                  {editingItem ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManager;
