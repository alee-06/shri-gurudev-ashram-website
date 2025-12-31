import SectionHeading from '../../components/SectionHeading';
import DonationFlow from './DonationFlow';
import DonorList from './DonorList';
import { donationHeads, recentDonors } from '../../data/dummyData';

const DonationPage = () => {
  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Make a Donation"
            subtitle="Choose a cause close to your heart and make a difference"
            center={true}
          />

          {/* Donation Heads */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {donationHeads.map((head) => (
              <div key={head.id} className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <div className="text-4xl mb-3">{head.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">{head.name}</h3>
                <p className="text-gray-700">{head.description}</p>
              </div>
            ))}
          </div>

          {/* Impact Section */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-amber-100">Families Fed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-amber-100">Children Educated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2,000+</div>
                <div className="text-amber-100">Medical Camps</div>
              </div>
            </div>
          </div>

          {/* Live Donor List */}
          <DonorList donors={recentDonors} />

          {/* Donation Flow */}
          <DonationFlow />
        </div>
      </section>
    </>
  );
};

export default DonationPage;

