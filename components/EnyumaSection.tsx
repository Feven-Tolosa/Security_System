"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import EnyumaIAM from "../public/image/EnyumaIAM.png";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function EnyumaSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const { t } = useLanguage();

  const paragraphOptions = [t("enyuma_p1"), t("enyuma_p2"), t("enyuma_p3")];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Paragraph fade-in
      gsap.from(".enyuma-fade", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".enyuma-fade",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        stagger: 0.2,
      });

      // Image rotation
      gsap.to(imageRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "linear",
        transformOrigin: "50% 50%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Content Overlay with responsive padding */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8  sm:py-10 md:py-10 mt-5">
        <div className="w-full max-w-6xl p-6 sm:p-8 md:p-10 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-6 md:gap-10 bg-white/10 backdrop-blur-md m-4 sm:my-5 md:my-5  ">
          {/* Text Section (left) */}
          <div className="w-full lg:w-1/2 text-white space-y-4 md:space-y-6">
            {/* Gradient Heading with responsive sizing */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00E0FF] via-white to-[#00E0FF] text-transparent bg-clip-text">
              {t("enyuma_title")}
            </h2>

            {/* Styled Button with responsive sizing */}
            <div className="mt-4 md:mt-6">
              <Link
                href="/Enyuma_IAM"
                className="text-white border border-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition-all duration-300 text-sm sm:text-base md:text-lg"
              >
                {t("common_view_page")}
              </Link>
            </div>

            {/* Paragraphs with responsive spacing */}
            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
              {paragraphOptions.map((text, index) => (
                <div
                  key={index}
                  className="enyuma-fade flex items-start gap-3 md:gap-4 text-sm sm:text-base md:text-lg text-gray-300 leading-6 sm:leading-7 md:leading-8"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#00E0FF] flex-shrink-0 mt-0.5"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"
                    />
                  </svg>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section (right) - Always visible with responsive sizing */}
          <div className="w-full lg:w-1/2 flex justify-center items-center order-first lg:order-none mb-6 lg:mb-0">
            <div className="relative w-full max-w-[280px] h-[168px] sm:max-w-[350px] sm:h-[210px] md:max-w-[450px] md:h-[300px] lg:max-w-[550px] lg:h-[350px] bg-transparent">
              <Image
                ref={imageRef}
                src={EnyumaIAM}
                alt="Enyuma"
                fill
                className="object-contain rounded-lg shadow-lg"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .enyuma-fade {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}

export default EnyumaSection;
