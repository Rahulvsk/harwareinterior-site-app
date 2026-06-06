import React from "react";
import Link from "next/link";
import Image from "next/image";

//internal import
import { ctaCardData } from "@utils/data";

const Card = () => {
  return (
    <>
      {ctaCardData.map((item) => (
        <div style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
          key={item.id}
          className="mx-auto w-full relative  overflow-hidden transition ease-out duration-400 delay-150 transform hover:shadow-xl"
        >
          <Link href={item.url} className="block">
            <div className="relative w-[550px] h-[234px]">
              <Image
                src={item.image}
                alt={item.title}
                width={550}
                height={234}
                className="object-cover w-full h-full"
                priority
              />
              {/* Black overlay */}
              <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
            </div>
            <div className="absolute top-0 left-0 z-10 p-r-16 flex-col flex w-full text-center justify-center">
              <div className="pt-4">
                <h2 className=" text-base sm:text-lg md:text-lg lg:text-lg font-semibold text-gray-100">
                  {item.title} <br />
                  <span className="text-lg sm:text-2xl md:text-2xl lg:text-2xl font-bold text-white">
                    {item.subTitle}
                  </span>
                </h2>
                <p className="text-sm font-sans text-gray-50 px-20" >
                 {item.hastag}
                </p>
                <button className=" sm:block lg:block text-xs mx-auto leading-6  font-medium mt-4 px-4 py-1 bg-black text-center rounded-full text-white hover:bg-emerald-600">
                  Shop Now
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Card;
