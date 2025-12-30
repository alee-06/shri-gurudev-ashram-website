import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import EventCard from "../components/EventCard";
import { events } from "../data/dummyData";

const Events = () => {
  const [filter, setFilter] = useState("all");
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");

  const displayEvents =
    filter === "all"
      ? events
      : filter === "upcoming"
      ? upcomingEvents
      : pastEvents;

  return (
    <>
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Events & Programs
          </h1>
          <p className="text-xl text-gray-700">
            Gurupurnima, Janmashtami, Gita Jayanti, श्री गुरुदेव आश्रम वर्धापन
            दिन, और सालभर के satsang व सेवा कार्यक्रम
          </p>
        </div>
      </section>

      {/* Context pulled from brochure and footer */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              प्रमुख उत्सव
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>श्री गुरुदेव आश्रम वर्धापन दिन महोत्सव</li>
              <li>गुरुपूर्णिमा महोत्सव</li>
              <li>श्रीकृष्ण जन्माष्टमी</li>
              <li>गुरु महाराज पुण्यतिथि महोत्सव</li>
              <li>गीता जयंती महोत्सव</li>
              <li>श्रीदत्त जयंती महोत्सव</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              Daily Darshan & Aarti
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>काकड़ा आरती - सुबह 4 बजे</li>
              <li>दैनिक सुबह आरती - सुबह 6 बजे</li>
              <li>हरिपाठ - शाम 6 बजे</li>
              <li>गीता पाठ - रात 8 बजे</li>
              <li>Darshan: 04:30 am - 01:00 pm, 04:30 pm - 09:00 pm</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              समय विशेष अवसरों पर परिवर्तित हो सकते हैं।
            </p>
          </div>
        </div>
      </section>

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
