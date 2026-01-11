import SectionHeading from "../components/SectionHeading";
import GalleryGrid from "../components/GalleryGrid";
import { useGallery } from "../context/GalleryContext";

const Gallery = () => {
  const { getVisibleItems, getCategories } = useGallery();
  const images = getVisibleItems();
  const categories = getCategories();

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Photo Gallery"
            subtitle="Capturing beautiful moments from our ashram activities and events"
            center={true}
          />
          <GalleryGrid images={images} categories={categories} />
        </div>
      </section>
    </>
  );
};

export default Gallery;
