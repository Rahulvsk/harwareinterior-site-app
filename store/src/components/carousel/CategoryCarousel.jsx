import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

// internal import
import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryCarousel = ({ categories }) => {
  const router = useRouter();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const { showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, category) => {
    const category_name = showingTranslateValue(category)
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${category_name}&_id=${id}`);
  };

  // Bind navigation elements to the swiper instance after render
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // Delay to ensure refs are attached to DOM
    const t = setTimeout(() => {
      if (!prevRef.current || !nextRef.current) return;

      try {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;

        // destroy existing navigation (if any) then re-init
        if (swiper.navigation && swiper.navigation.destroy) {
          try {
            swiper.navigation.destroy();
          } catch (err) {
            // ignore
          }
        }

        swiper.navigation.init();
        swiper.navigation.update();
      } catch (err) {
        // safety: ignore initialization errors
        // console.error("Swiper navigation init error:", err);
      }
    }, 0);

    return () => clearTimeout(t);
  }, []); // run once on mount

  return (
    <>
      <Swiper
        // capture instance so we can re-bind navigation later
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        spaceBetween={8}
        // leave navigation prop object empty (we set prev/next via refs in useEffect)
        navigation={false}
        allowTouchMove={false}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          375: {
            width: 375,
            slidesPerView: 2,
          },
          414: {
            width: 414,
            slidesPerView: 3,
          },
          660: {
            width: 660,
            slidesPerView: 4,
          },
          768: {
            width: 768,
            slidesPerView: 6,
          },
          991: {
            width: 991,
            slidesPerView: 8,
          },
          1140: {
            width: 1140,
            slidesPerView: 9,
          },
          1680: {
            width: 1680,
            slidesPerView: 10,
          },
          1920: {
            width: 1920,
            slidesPerView: 10,
          },
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper category-slider my-10 relative"
      >
        {categories[0]?.children?.map((category, i) => (
          <SwiperSlide key={i + 1} className="group">
            <div
              onClick={() =>
                handleCategoryClick(category?._id, category.name)
              }
              className="text-center cursor-pointer p-3 bg-white rounded-lg"
            >
             <div className="bg-white p-2 mx-auto my-auto text-center w-20 h-20 rounded-full shadow-md flex items-center justify-center">
  <Image
    src={
      category?.icon ||
      "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
    }
    alt="category"
    width={80}
    height={80}
    className="object-cover rounded-full"
  />
</div>


              <h3 className="text-xs text-gray-600 mt-2 group-hover:text-emerald-500">
                {showingTranslateValue(category?.name)}
              </h3>
            </div>
          </SwiperSlide>
        ))}

        {/* navigation buttons — refs used to bind to Swiper */}
        <button
          ref={prevRef}
          className="prev absolute left-2 top-1/2 z-20 p-2 bg-white rounded-full shadow-md transform -translate-y-1/2"
          aria-label="Previous"
        >
          <IoChevronBackOutline />
        </button>

        <button
          ref={nextRef}
          className="next absolute right-2 top-1/2 z-20 p-2 bg-white rounded-full shadow-md transform -translate-y-1/2"
          aria-label="Next"
        >
          <IoChevronForward />
        </button>
      </Swiper>
    </>
  );
};

export default React.memo(CategoryCarousel);
