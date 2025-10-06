"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import nisir_dark from "../public/image/nisir_dark.png";
import NisirImage from "../public/image/Nisir.png";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function NisirSIEMSection() {
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  const paragraphOptions = [t("nisir_p1"), t("nisir_p2"), t("nisir_p3")];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".siem-fade", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".siem-fade",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 mt-5">
        <div className="w-full max-w-6xl siem-fade p-6 sm:p-8 md:p-10  shadow-xl flex flex-col lg:flex-row items-center gap-6 md:gap-10 bg-white/10 backdrop-blur-md m-4 sm:my-5 md:my-5 sm:rounded-xl ">
          {/* Image Section with precise sizing */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-[280px] h-[210px] sm:w-[320px] sm:h-[240px] md:w-[400px] md:h-[300px] lg:w-[450px] lg:h-[350px] rotate-animation bg-transparent">
              <Image
                src={NisirImage}
                alt="Nisir SIEM"
                fill
                className="object-contain rounded-lg shadow-lg"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
                priority
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 text-white space-y-4 md:space-y-6">
            {/* 🔹 Heading with larger image in front of SIEM */}
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              <img
                src="/image/nisir_dark.png" // Replace with your actual image path
                alt="SIEM Icon"
                className="w-[2em] h-[em] object-contain"
                style={{ verticalAlign: "middle" }}
              />
              {t("nisir_heading")}
            </h2>

            <Link
              href="/Nisir"
              className="inline-block text-white border border-white rounded-md px-4 py-2 sm:px-5 sm:py-2.5 bg-primary hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition-all duration-300 text-sm sm:text-base md:text-lg"
            >
              {t("common_view_page")}
            </Link>

            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
              {paragraphOptions.map((text, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#00E0FF] flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"></path>
                  </svg>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-6 sm:leading-7 md:leading-8">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotateLR {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-5deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .rotate-animation {
          animation: rotateLR 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default NisirSIEMSection;
