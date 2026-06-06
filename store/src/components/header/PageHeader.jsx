import React from "react";
import { cookies } from "next/headers";

//internal imports

const PageHeader = async ({ title, headerBg }) => {
  const cookiesStore = await cookies();
  const lang = cookiesStore.get("_lang")?.value;
  const showingTranslateValue = (data) => {
    const updatedData =
      data !== undefined && Object?.keys(data).includes(lang)
        ? data[lang]
        : data?.en;
    // console.log("lang:::", lang, "updatedData", updatedData);
    return updatedData;
  };

  return (
<div
  style={{
    backgroundImage: `url("https://res.cloudinary.com/dqsbaiebh/image/upload/v1758304357/nnz0islcee9arfsl3hzb.jpg")`,
  }}
  className="relative w-full aspect-[1920/373] bg-cover bg-center flex justify-center items-center"
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content on top of overlay */}
  <div className="relative flex mx-auto w-full max-w-screen-2xl px-3 sm:px-10">
    <div className="w-full flex justify-center flex-col items-center">
      <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-white text-center drop-shadow-lg">
        {showingTranslateValue(title)}
      </h2>
    </div>
  </div>
</div>

  );
};

export default PageHeader;
