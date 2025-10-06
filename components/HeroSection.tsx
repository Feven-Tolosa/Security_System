"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Security from "../public/image/Security.png"; // Adjust the path as necessary
import Link from "next/link";
import TextType from "@/components/TextType";
import { useLanguage } from "@/contexts/LanguageContext";
export default function HeroSection() {
  const { theme } = useTheme();
  const controls = useAnimation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  // Image animation sequence
  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start({ opacity: 0.3, transition: { duration: 3 } });
        await controls.start({ opacity: 1, transition: { duration: 3 } });
      }
    };
    sequence();
  }, [controls]);

  // Detect theme change
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  return (
    <section
      className={`'relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ' ${
        theme === "dark" ? "dark-theme-styles" : "light-theme-styles"
      } `}
    >
      <div className="relative w-full h-full z-10 max-w-7xl m-20 mx-auto  grid grid-cols-1 lg:grid-cols-2 gap-1 items-center mt-10 pr-20 bg-transparent">
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-4xl sm:text-4xl md:text-5xl  md:tracking-widest sm:tracking-tight font-extrabold leading-10 '  ${
              isDarkMode
                ? " bg-gradient-to-r from-primary via-white to-primary text-transparent bg-clip-text md:leading-16"
                : "bg-gradient-to-r from-primary via-white to-primary text-transparent bg-clip-text text-shadow-black md:leading-16"
            }`}
          >
            <span className="block ">{t("hero_secure_your")}</span>
            <span className="block">{t("hero_systems_with")}</span>

            <span
              className={`block ${
                isDarkMode
                  ? " bg-gradient-to-r from-primary via-white to-primary text-transparent bg-clip-text"
                  : "  bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text"
              }`}
            >
              {t("hero_advanced_solutions")}
            </span>
          </motion.h1>

          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`mt-6 text-lg sm:text-xl text-gray-300 ${
              isDarkMode ? 'text-gray-300' : 'text-white'
            }`}
          >
            Trust our homegrown solutions to secure your systems.
          </motion.p> */}

          <TextType
            text={[
              t("hero_typing_trust_1"),
              t("hero_typing_trust_2"),
              t("hero_typing_trust_3"),
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>

        {/* Animated Image */}
        <motion.div
          animate={controls}
          className={`sm:hidden lg:block ${
            isDarkMode
              ? "hidden w-full lg:w-3/2 lg:block"
              : "hidden w-full lg:w-3/2 lg:block"
          } `}
        >
          <Image
            src={Security}
            alt="Animated Image"
            className="w-full h-auto fill"
          />
          <div
            className={`absolute inset-0 rounded-lg ${
              isDarkMode ? "bg-primary-900/20" : "bg-primary-200/20"
            }`}
          ></div>
        </motion.div>
      </div>

      {/* Scrolling indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 sm:hidden lg:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-8 h-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
