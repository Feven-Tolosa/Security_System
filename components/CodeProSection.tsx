"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import codeprotection from "../public/image/Code Protection.png";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const ProductSection = () => {
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
        duration: 1.8,
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
          duration: 1.8,
          ease: "power2.out",
        })
        .to(
          imageRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
          },
          "<"
        );
    }
  }, []);

  const ShieldIcon = () => (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 text-[#00E0FF] flex-shrink-0 mt-1"
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
    <div className="relative w-full flex justify-center items-center py-12 sm:py-16 md:py-20 overflow-hidden bg-transparent mx-2">
      {/* Overlay Content with responsive padding */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 md:gap-10 transition-all duration-700 mx-6"
      >
        {/* Text Section */}
        <div
          ref={textRef}
          className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-white"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3 group">
            {t("cp_title")}
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* <p className='text-sm sm:text-base md:text-lg text-gray-300 flex items-start gap-3 group'>
              <ShieldIcon />
              Secure your cyber estate while building a resilient, future-ready
              business. In todays rapidly evolving digital landscape, cyber
              defense must continuously adapt to new vulnerabilities and attack
              vectors.
            </p> */}
            {/* DecryptedText*/}
            <DecryptedText
              text={`${t("cp_para_1")}

${t("cp_para_2")}`}
              speed={100}
              maxIterations={20}
              characters="AB&*1234!$%#?"
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
            />
            {/* <p className="text-sm sm:text-base md:text-lg text-gray-300 flex items-start gap-3 group">
              <ShieldIcon />
              The TCS Cyber Defense Suite offers integrated services tailored to
              modern enterprise needs. It provides enhanced visibility,
              protection, detection, response, recovery, and governance — all
              aligned with industry standards like NIST CSF and CIS.
            </p> */}
            {/* 
            <p className="text-sm sm:text-base md:text-lg text-gray-300 flex items-start gap-3 group">
              <ShieldIcon />
               The TCS Cyber Defense Suite offers integrated services tailored to
              modern enterprise needs. It provides enhanced visibility,
              protection, detection, response, recovery, and governance — all
              aligned with industry standards like NIST CSF and CIS.
            </p> */}
          </div>

          <Link
            href="/Code_Protection"
            className="text-white border border-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-primary hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition-all duration-300 text-sm sm:text-base md:text-lg"
          >
            {t("common_view_page")}
          </Link>
        </div>

        {/* Image Section - Always visible with responsive sizing */}
        <div
          ref={imageRef}
          className="w-full lg:w-1/2 flex justify-center items-center order-first lg:order-none mb-6 lg:mb-0"
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] aspect-square">
            <Image
              src={codeprotection}
              alt="Cyber Defense"
              fill
              className="rounded-lg shadow-lg object-contain"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 500px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
