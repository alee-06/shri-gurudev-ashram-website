import { useState, useEffect } from "react";
import { useAnnouncement } from "../../context/AnnouncementContext";

const AnnouncementBannerManager = () => {
  const { announcement, updateAnnouncement } = useAnnouncement();
  const [localMessage, setLocalMessage] = useState(announcement.message);
  const [localActive, setLocalActive] = useState(announcement.active);
  const [localPriority, setLocalPriority] = useState(announcement.priority || 1);

  // Sync local state with context when it changes externally
  useEffect(() => {
    setLocalMessage(announcement.message);
    setLocalActive(announcement.active);
    setLocalPriority(announcement.priority || 1);
  }, [announcement]);

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setLocalMessage(newMessage);
    updateAnnouncement({ message: newMessage });
  };

  const handleActiveToggle = (e) => {
    const newActive = e.target.checked;
    setLocalActive(newActive);
    updateAnnouncement({ active: newActive });
  };

  const handlePriorityChange = (e) => {
    const newPriority = parseInt(e.target.value) || 1;
    setLocalPriority(newPriority);
    updateAnnouncement({ priority: newPriority });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcement Banner Manager</h1>
        <p className="text-gray-600 text-sm mt-1">
          Control the announcement banner displayed on the public website
        </p>
      </div>

      <div className="space-y-6">
        {/* Message Text Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Announcement Message
          </label>
          <textarea
            value={localMessage}
            onChange={handleMessageChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter announcement message..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This message will be displayed in the banner at the top of the website
          </p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Banner Visibility
            </label>
            <p className="text-xs text-gray-600">
              {localActive 
                ? "Banner is currently visible on the website" 
                : "Banner is currently hidden"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localActive}
              onChange={handleActiveToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {/* Priority Input (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Priority (Optional)
          </label>
          <input
            type="number"
            value={localPriority}
            onChange={handlePriorityChange}
            min="1"
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Higher priority announcements may be displayed first (if multiple banners are supported in future)
          </p>
        </div>

        {/* Preview Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Preview</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {localActive && localMessage ? (
              <div className="bg-amber-500 text-white py-3 md:py-4 px-2 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                  <div className="flex items-center gap-4 w-full min-h-6">
                    <div className="flex-1 text-center">
                      <p className="text-sm md:text-base font-medium leading-relaxed">
                        {localMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-500 py-8 text-center">
                <p className="text-sm">
                  {!localActive 
                    ? "Banner is hidden (active = false)" 
                    : "Enter a message to see preview"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBannerManager;
