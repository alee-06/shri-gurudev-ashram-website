import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import EventCard from "../components/EventCard";
import { useEvents } from "../context/EventsContext";

const Events = () => {
  const { getVisibleEvents } = useEvents();
  const allEvents = getVisibleEvents();
  const [filter, setFilter] = useState("all");
  const upcomingEvents = allEvents.filter((e) => e.status === "upcoming");
  const pastEvents = allEvents.filter((e) => e.status === "past");

  const displayEvents =
    filter === "all"
      ? allEvents
      : filter === "upcoming"
      ? upcomingEvents
      : pastEvents;

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[
              { value: "all", label: "All Events" },
              { value: "upcoming", label: "Upcoming" },
              { value: "past", label: "Past Events" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  filter === option.value
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No events found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;
