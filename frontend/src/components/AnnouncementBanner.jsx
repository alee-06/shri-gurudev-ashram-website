import { useAnnouncement } from "../context/AnnouncementContext";

const AnnouncementBanner = () => {
  const { announcement } = useAnnouncement();

  // Only render if active is true and message exists
  if (!announcement.active || !announcement.message) return null;

  return (
    <div className="bg-amber-500 text-white py-3 md:py-4 px-2 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-4 w-full min-h-6">
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {announcement.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
