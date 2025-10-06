"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import EnyumaIAM from "../../public/image/EnyumaIAM.png";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

function EnyumaSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const { t } = useLanguage();

  const paragraphOptions = [t("enyuma_p1"), t("enyuma_p2"), t("enyuma_p3")];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 🔹 Paragraph fade-in
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

      // Image rotation - only on larger screens
      if (window.innerWidth >= 768) {
        gsap.to(imageRef.current, {
          rotation: 360,
          duration: 10,
          repeat: -1,
          ease: "linear",
          transformOrigin: "50% 50%",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden mt-24 md:mt-24"
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-8 md:py-10">
        <div className="w-full max-w-6xl p-4 sm:p-6 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-6 md:gap-8 bg-white/10 backdrop-blur-md">
          {/* 📄 Text Section (left) */}
          <div className="w-full lg:w-1/2 text-white space-y-4">
            {/* 🔹 Gradient Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00E0FF] via-white to-[#00E0FF] text-transparent bg-clip-text">
              {t("enyuma_title")}
            </h2>

            {/* Styled Button refer to the link */}
            <div className="mt-2 md:mt-4 py-2 md:py-3">
              <Link
                href="https://enyumaiam.insa.gov.et/index"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 md:px-6 md:py-3 border border-[#00E0FF] text-[#00E0FF] font-semibold rounded-[2px] bg-transparent hover:bg-[#00E0FF] hover:text-black transition duration-300 text-sm md:text-base"
              >
                {t("cp_show_product")}
              </Link>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
              {paragraphOptions.map((text, index) => (
                <div
                  key={index}
                  className="enyuma-fade flex items-start gap-2 md:gap-3 text-sm md:text-base text-gray-300 leading-relaxed"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-[#00E0FF] flex-shrink-0 mt-0.5"
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

          {/* Image Section (right) */}
          <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0">
            <div className="max-w-xs sm:max-w-sm md:max-w-md w-full">
              <Image
                ref={imageRef}
                src={EnyumaIAM}
                alt="Enyuma"
                width={500}
                height={300}
                className="w-full rounded-lg shadow-lg"
                priority={false}
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

        @media (max-width: 640px) {
          .absolute {
            position: relative;
          }
        }
      `}</style>
    </div>
  );
}

export default EnyumaSection;
