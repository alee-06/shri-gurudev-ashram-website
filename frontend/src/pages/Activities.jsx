import SectionHeading from "../components/SectionHeading";
import ProgramCard from "../components/ProgramCard";
import { activities } from "../data/dummyData";
import { useState } from "react";

const Activities = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "spiritual", "social", "charitable"];

  const filteredActivities =
    selectedCategory === "all"
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Our Activities"
            subtitle="Engage in spiritual practices, social service, and charitable programs"
            center={true}
          />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-lg transition-colors capitalize ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {cat === "all" ? "All Activities" : cat}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ProgramCard key={activity.id} program={activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Want to Participate?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join us in our various activities and programs. Your participation
            makes a difference!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
};

export default Activities;
