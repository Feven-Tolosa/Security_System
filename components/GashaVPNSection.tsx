"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import GashaVPN from "../public/image/GashVPN.png";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function GashaVPNSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { t } = useLanguage();

  const paragraphOptions = [
    t("gasha_vpn_p1"),
    t("gasha_vpn_p2"),
    t("gasha_vpn_p3"),
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".vpn-fade", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".vpn-fade",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNextText = () => {
    gsap.to(textRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentTextIndex((prev) => (prev + 1) % paragraphOptions.length);
        gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
      },
    });
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-6xl vpn-fade p-6 sm:p-8 lg:p-10 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white/10 backdrop-blur-md mx-4">
          {/* Image Section - Updated to match other components */}
          <div className="w-full lg:w-1/2 animate-[float_4s_ease-in-out_infinite]">
            <div className="relative aspect-video lg:aspect-square lg:h-[350px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={GashaVPN}
                alt="Gasha VPN"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                priority
              />
            </div>
          </div>

          {/* Text Section - Updated for consistency */}
          <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-300">
              <span className="text-white">
                {t("gasha_vpn_title").split(" ")[0]}{" "}
              </span>
              <span className="text-[#00E0FF] hover:text-[#38BDF8]">
                {t("gasha_vpn_title").split(" ")[1]}
              </span>
            </h2>

            <p
              ref={textRef}
              className="text-base sm:text-lg text-gray-300 leading-relaxed transition-opacity duration-500 min-h-[120px] sm:min-h-[150px]"
            >
              {paragraphOptions[currentTextIndex]}
            </p>

            <div className="mt-4 sm:mt-6">
              <Link
                href="/Gasha"
                className="text-white border border-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition-all duration-300 text-sm sm:text-base inline-block"
              >
                {t("common_view_page")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

export default GashaVPNSection;
