"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import abis from "../public/image/abis.png";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
gsap.registerPlugin(ScrollTrigger);

const BiometricSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (containerRef.current && textRef.current && imageRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(textRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
      })
        .to(
          imageRef.current,
          {
            x: -100,
            opacity: 0,
            duration: 1.4,
            ease: "power2.out",
          },
          "<"
        )
        .add(() => {
          containerRef.current?.classList.toggle("lg:flex-row-reverse");
        })
        .to(textRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        })
        .to(
          imageRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
          },
          "<"
        );
    }
  }, []);

  const ShieldIcon = () => (
    <svg
      className="w-6 h-6 text-[#00E0FF] flex-shrink-0"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"
      />
    </svg>
  );

  return (
    <div className="relative w-full flex justify-center items-center py-20 overflow-hidden bg-transparent">
      {/*  Overlay Content */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl  bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col lg:flex-row items-center gap-10 transition-all duration-700 mx-6"
      >
        {/* Text Section */}
        <div ref={textRef} className="w-full lg:w-1/2 space-y-6 text-white">
          <h2 className="text-4xl font-bold flex items-center gap-3 group">
            {t("biometrics_title")}
          </h2>

          <p className="text-lg text-gray-300 flex items-start gap-3 group">
            <ShieldIcon />
            {t("bio_para_1")}
          </p>

          <p className="text-lg text-gray-300 flex items-start gap-3 group">
            <ShieldIcon />
            {t("bio_para_2")}
          </p>

          <p className="text-lg text-gray-300 flex items-start gap-3 group">
            <ShieldIcon />
            {t("bio_para_3")}
          </p>

          <Link
            href="/Biometrics"
            className="text-white border border-white rounded-md px-4 py-2 bg-primary hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300"
          >
            {t("common_view_page")}
          </Link>
        </div>

        {/*  Image Section */}
        <div
          ref={imageRef}
          className="w-full lg:w-1/2 flex justify-center items-center lg:block sm:hidden"
        >
          <Image
            src="/image/abis.png"
            alt="Biometric Protection"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default BiometricSection;
