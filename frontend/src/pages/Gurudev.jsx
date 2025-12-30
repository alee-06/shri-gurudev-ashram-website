import SectionHeading from "../components/SectionHeading";

const Gurudev = () => {
  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Param Pujya Shri Swami Harichaitanyanand Saraswatiji Maharaj"
            center={true}
          />
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4 text-center">
              श्री गुरुदेव आश्रम (पलसखेड सपकाल, चिखली, बुलडाणा) और स्वामी
              हरिचैतन्य शान्ति आश्रम ट्रस्ट (दाताला, मलकापूर) Gurudev ji का
              आध्यात्मिक और सेवा क्षेत्र है।
            </p>
            <p className="text-gray-700 mb-4">
              Gurudev ji ने भक्ति, ज्ञान और निस्वार्थ सेवा को एक साथ जीने का
              मार्ग दिखाया है। आश्रम में दैनिक सत्संग, गीता पाठ, हरिपाठ,
              अन्नदान, शिक्षा, चिकित्सा, गौशाला, गुरुकुलम्, आदिवासी सेवा, अनाथ
              आश्रम और सेवा तीर्थ धाम के माध्यम से समाज की सेवा की जाती है।
            </p>
            <p className="text-gray-700 mb-4">
              हर सेवा कार्य का उद्देश्य मन की शुद्धि और समाज के उत्थान को साथ
              लेना है। Gurudev ji द्वारा प्रेरित शाखाएँ और सेवाएँ देश के अलग-अलग
              भागों में भक्तों को जोड़ती हैं।
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="Teachings & Daily Sadhana" center={true} />
          <div className="space-y-6">
            {[
              {
                title: "Bhakti, Gyan, Seva",
                content:
                  "भक्ति रस से भरा सत्संग, श्रीमद्भगवद् गीता का अध्ययन और निस्वार्थ सेवा को एक ही साधना माना जाता है।",
              },
              {
                title: "स्मरण और जप",
                content:
                  "हरिपाठ, गीता पाठ और नामस्मरण को दिनचर्या का हिस्सा बनाना मन को स्थिर करता है।",
              },
              {
                title: "Atma Seva Through Lok Seva",
                content:
                  "अन्नदान, गुरुकुल, अनाथ आश्रम, गौशाला और चिकित्सा सेवा के माध्यम से समाज की सेवा ही आत्मसेवा है।",
              },
            ].map((teaching, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-amber-900 mb-3">
                  {teaching.title}
                </h3>
                <p className="text-gray-700">{teaching.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <SectionHeading title="Daily Aarti & Darshan" center={false} />
            <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>काकड़ा आरती - सुबह 4 बजे</li>
                <li>दैनिक सुबह आरती - सुबह 6 बजे</li>
                <li>हरिपाठ - शाम 6 बजे</li>
                <li>गीता पाठ - रात 8 बजे</li>
                <li>Darshan: 04:30 am - 01:00 pm, 04:30 pm - 09:00 pm</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                विशेष अवसरों पर समयांतर हो सकता है।
              </p>
            </div>
          </div>

          <div>
            <SectionHeading title="Ashram Branches" center={false} />
            <div className="bg-amber-50 p-6 rounded-lg shadow-sm space-y-2 text-gray-700">
              <p>श्री वैष्णवी गीता आश्रम, मालविहिर, जिला बुलडाणा</p>
              <p>
                श्री हरिचैतन्य शांति आश्रम, दाताला, तहसील मलकापूर, जिला बुलडाणा
              </p>
              <p>श्री गुरुदेव आश्रम, मुक्ताईनगर, जिला जलगांव</p>
              <p>श्री गुरुदेव आश्रम, कोथाला, तहसील मानवत, जिला परभणी</p>
              <p>श्री हरिचैतन्य गोधाम, शिंदी हराली, चिखली, जिला बुलढाणा</p>
              <p>श्री बालमुकुंद आश्रम, बेलगांव, कर्नाटक</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gurudev;
