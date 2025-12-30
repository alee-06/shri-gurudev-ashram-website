import SectionHeading from "../components/SectionHeading";
import TestimonialCard from "../components/TestimonialCard";
import { testimonials } from "../data/dummyData";

const Testimonials = () => {
  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Devotee Testimonials"
            subtitle="Stories of transformation, gratitude, and spiritual growth"
            center={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Experience */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Share Your Experience
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We would love to hear about your journey with us. Your story can
            inspire others!
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

export default Testimonials;
