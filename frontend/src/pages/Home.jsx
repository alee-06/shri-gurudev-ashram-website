import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import ProgramCard from "../components/ProgramCard";
import EventCard from "../components/EventCard";
import DonationCard from "../components/DonationCard";
import CTABanner from "../components/CTABanner";
import {
  donationHeads,
} from "../data/dummyData";
import { useEvents } from "../context/EventsContext";
import { useActivities } from "../context/ActivitiesContext";

const Home = () => {
  const { getVisibleEvents } = useEvents();
  const { getVisibleActivities } = useActivities();
  const featuredActivities = getVisibleActivities().slice(0, 6);
  const upcomingEvents = getVisibleEvents()
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  return (
    <>
      <HeroSection
        title="Shri Gurudev Ashram Palaskhed Sapkal"
        subtitle="Param Pujya Shri Swami Harichaitanyanand Saraswatiji Maharaj's seva kshetra for bhakti, gyan and nishkam seva"
        image="/assets/Home_Page.JPG"
        showCTA={true}
      />

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="About Our Ashram"
            subtitle="Serving devotees through satsang, annadan, शिक्षा, गोसेवा और निस्वार्थ सेवा"
            center={true}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Ashram Locations
              </h3>
              <p className="text-gray-700">
                श्री गुरुदेव आश्रम, पलसखेड सपकाल, तहसील चिखली, जिला बुलडाणा,
                महाराष्ट्र - 443001
              </p>
              <p className="text-gray-700 mt-3">
                स्वामी हरिचैतन्य शान्ति आश्रम ट्रस्ट, दाताला, तहसील मलकापूर,
                जिला बुलडाणा - 443102
              </p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Darshan & Aarti
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>काकड़ा आरती - सुबह 4 बजे</li>
                <li>दैनिक सुबह आरती - सुबह 6 बजे</li>
                <li>हरिपाठ - शाम 6 बजे</li>
                <li>गीता पाठ - रात 8 बजे</li>
                <li>Darshan: 04:30 am - 01:00 pm, 04:30 pm - 09:00 pm</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Temple timings may change on special occasions.
              </p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Connect With Us
              </h3>
              <p className="text-gray-700">मो. 9158740007, 9834151577</p>
              <p className="text-gray-700">info@shrigurudevashram.org</p>
              <p className="text-gray-700">info@shantiashramtrust.org</p>
              <p className="text-gray-700">www.shrigurudevashram.org</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Our Activities"
            subtitle="अन्नदान, गुरुकुलम्, आदिवासी सेवा, गौशाला, अनाथ आश्रम और सेवा तीर्थ धाम जैसी प्रमुख सेवाएँ"
            center={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActivities.map((activity) => (
              <ProgramCard key={activity.id} program={activity} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/activities"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              View All Activities
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Join us for spiritual gatherings, seva programs, and special celebrations"
            center={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/events"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Support Our Cause"
            subtitle="Your generous contributions help us serve more people and spread love and compassion"
            center={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationHeads.slice(0, 3).map((head) => (
              <DonationCard key={head.id} donation={head} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Join Us in Making a Difference"
        description="Your support helps us continue our mission of service and spiritual growth"
        primaryAction={{ path: "/donate", label: "Donate Now" }}
        secondaryAction={{ path: "/shop", label: "Visit Shop" }}
      />
    </>
  );
};

export default Home;
