"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import GashaAntivirus from "../public/image/GashAntivirus.png";
import Link from "next/link";
import ScrambledText from "@/components/ScrambledText";
import { useLanguage } from "@/contexts/LanguageContext";
function GashaAntSection() {
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fade-in",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <section className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 lg:p-10 shadow-xl w-full max-w-6xl mx-4 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Image Section - Adjusted sizing */}
            <div className="w-full lg:w-1/2 fade-in">
              <div className="relative aspect-video lg:aspect-square lg:h-[350px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={GashaAntivirus}
                  alt="Gasha Antivirus"
                  fill
                  className="object-contain" // Changed to contain for better visibility
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                  priority
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-7 text-primary hover:text-[#38BDF8] transition-colors duration-300 px-8">
                {t("gasha_av_title")}
              </h2>
              {/* <p className='mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-gray-100'>
                A robust and intelligent defense system designed to safeguard
                your digital world from viruses, malware, ransomware, and
                evolving cyber threats. With cutting-edge technology, real-time
                protection, and advanced threat detection, it ensures your data,
                privacy, and devices stay secure.
              </p> */}

              <ScrambledText
                className="scrambled-text-demo font-sans"
                radius={100}
                duration={1.2}
                speed={0.5}
                scrambleChars=":.ኢንሳሂኡፍርፍቅወርትዩኢኦፕ"
              >
                {" "}
                {t("gasha_av_desc")}
              </ScrambledText>
              <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 fade-in px-20">
                <Link
                  href="/Gasha"
                  className="text-white border border-white rounded-md px-3 py-1.5 sm:px-9 sm:py-2 hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition-all duration-300 text-sm sm:text-base"
                >
                  {t("common_view_page")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GashaAntSection;
