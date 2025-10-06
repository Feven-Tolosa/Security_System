"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlitchText from "@/components/GlitchText";
import { useLanguage } from "@/contexts/LanguageContext";
gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const ShieldIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-[#00E0FF] transition duration-300 group-hover:drop-shadow-[0_0_6px_#00E0FF]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
    </svg>
  );

  const handleSend = () => {
    if (!email.trim()) {
      setShowError(true);
      alert(t("contact_alert_fill_email"));
      return;
    }

    console.log("Sending email:", email);
    setEmail("");
    setShowError(false);
    // Integrate with backend or email service here
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full py-20 flex justify-center items-center bg-gray-950 overflow-hidden"
    >
      {/* 🔹 Glowing Border Container */}
      <div
        className="relative z-10 max-w-3xl w-full px-8 py-12 bg-black/80 backdrop-blur-md rounded-xl border border-primary group transition-all duration-500"
        style={{
          boxShadow: "0 0 40px rgba(0, 224, 255, 0.4)", // Static glow
        }}
      >
        <div ref={contentRef} className="space-y-6 text-white text-center">
          {/* <h2 className="text-3xl font-bold flex justify-center items-center gap-3 group">
          
            We’d love to hear from you
          </h2> */}
          <GlitchText
            speed={1}
            enableShadows={true}
            enableOnHover={true}
            className="custom-class"
          >
            {t("contact_title")}
          </GlitchText>

          <p className="text-lg text-gray-300 flex justify-center items-start gap-3 group">
            {t("contact_subtitle")}
          </p>

          {/* Email Input + Send Button */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact_placeholder_email")}
              required
              className={`px-4 py-2 w-64 rounded-lg bg-gray-950 border ${
                showError ? "border-red-500" : "border-primary"
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              onClick={handleSend}
              className="px-5 py-2 bg-primary hover:bg-secondary text-black font-semibold rounded-lg transition duration-300 hover:shadow-[0_0_10px_#00E0FF]"
            >
              {t("contact_send")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
