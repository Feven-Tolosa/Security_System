"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import GashaAntivirus from "../../public/image/GashAntivirus.png";
import GashVPN from "../../public/image/GashVPN.png";
import GashaWAF from "../../public/image/GashWAF.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import { useRequests } from "@/contexts/RequestsContext";
import { useDownloads } from "@/contexts/DownloadsContext";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  companyName: string;
  totalComputers: number;
  linuxOS: string;
  windowsOS: string;
  contactPerson: string;
  contactPhone: string;
  jobTitle: string;
  officeNumber: string;
  department: string;
  architecture: string;
  message: string;
  product: string;
}

// Rate limiting state
interface RateLimitState {
  count: number;
  lastRequest: number;
}

function Gasha() {
  const { addRequest } = useRequests();
  const { recordDownload } = useDownloads();
  const { t } = useLanguage();

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
    totalComputers: 0,
    linuxOS: "",
    windowsOS: "",
    contactPerson: "",
    contactPhone: "",
    jobTitle: "",
    officeNumber: "",
    department: "",
    architecture: "",
    message: "",
    product: "",
  });

  // Security state
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const rateLimitRef = useRef<RateLimitState>({ count: 0, lastRequest: 0 });
  const [csrfToken, setCsrfToken] = useState<string>("");

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Text rotation
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  // Product descriptions (VPN + WAF on-screen copy)
  const paragraphOptions: string[] = [
    `Gasha VPN is a secure tunneling solution designed to safeguard your digital footprint. It encrypts your internet traffic, masks your IP address, and ensures complete anonymity while browsing. Whether you're accessing public Wi-Fi or working remotely, Gasha VPN provides a fortified shield against cyber threats and surveillance.`,
    `Our advanced protocols protect you from data interception, ISP tracking, and geo-restrictions. With Gasha VPN, you can stream content, access restricted websites, and communicate freely—without compromising your privacy. It's the ultimate tool for digital freedom in an increasingly monitored world.`,
    `Powered by high-speed servers and military-grade encryption, Gasha VPN delivers a seamless experience across all devices. Enjoy lightning-fast connections, zero-logging policies, and intuitive controls that make security effortless. Whether you're a casual user or a cybersecurity professional, Gasha VPN adapts to your needs with precision and reliability.`,
  ];

  const paragraphOptionsGASHWAF: string[] = [
    `Gasha Web Application Firewall (WAF) is a security solution that protects web applications by filtering and monitoring HTTP traffic. It acts as a shield between your web server and the internet.`,
    `It defends against common attacks such as cross-site scripting (XSS), SQL injection, and other OWASP Top 10 threats. Gasha WAF intelligently blocks malicious requests before they reach your application.`,
    `With real-time monitoring and adaptive threat detection, Gasha WAF ensures your web services remain secure, reliable, and compliant with modern cybersecurity standards.`,
  ];

  // Generate CSRF token on component mount
  useEffect(() => {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setCsrfToken(token);
    sessionStorage.setItem("csrfToken", token);
  }, []);

  // Input validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[^\D][\d]{0,15}$/;
    return phone === "" || phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateText = (text: string, maxLength: number = 100): boolean => {
    return text.length <= maxLength;
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.companyName.trim())
      errors.companyName = "Company name is required";

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
      errors.contactPhone = "Please enter a valid phone number";
    }

    if (formData.name && !validateText(formData.name, 50)) {
      errors.name = "Name must be less than 50 characters";
    }

    if (formData.companyName && !validateText(formData.companyName, 100)) {
      errors.companyName = "Company name must be less than 100 characters";
    }

    if (formData.message && !validateText(formData.message, 500)) {
      errors.message = "Message must be less than 500 characters";
    }

    if (formData.totalComputers < 0 || formData.totalComputers > 10000) {
      errors.totalComputers =
        "Please enter a valid number of computers (0-10000)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const { count, lastRequest } = rateLimitRef.current;

    if (now - lastRequest > 60000) {
      rateLimitRef.current = { count: 1, lastRequest: now };
      return true;
    }

    if (count < 5) {
      rateLimitRef.current = { count: count + 1, lastRequest: now };
      return true;
    }

    return false;
  };

  // ==============================
  // PDF Generators with Download Tracking
  // ==============================
  const downloadAntivirusPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Gasha Antivirus Documentation", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      "Gasha Antivirus is a robust and intelligent defense system designed to safeguard your digital world from viruses, malware, ransomware, and evolving cyber threats.",
      20,
      40,
      { maxWidth: 170 }
    );
    doc.text("Key Features:", 20, 70);
    doc.text("- Real-Time Protection", 25, 80);
    doc.text("- AI-Powered Detection", 25, 90);
    doc.text("- Up-to-Date Database", 25, 100);
    doc.text("- Tamper Protection", 25, 110);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    recordDownload("GashaAntivirus.pdf", "1.5MB");
    window.open(pdfUrl);
  };

  const downloadVPNPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Gasha VPN Documentation", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(paragraphOptions[currentTextIndex], 20, 40, { maxWidth: 170 });
    doc.text("Benefits:", 20, 80);
    doc.text("- Protects from data interception", 25, 90);
    doc.text("- Avoids ISP tracking", 25, 100);
    doc.text("- Bypasses geo-restrictions", 25, 110);
    doc.text("- High-speed, reliable encryption", 25, 120);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    recordDownload("GashaVPN.pdf", "1.2MB");
    window.open(pdfUrl);
  };

  const downloadWAFPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Gasha WAF Documentation", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(paragraphOptionsGASHWAF[currentTextIndex], 20, 40, {
      maxWidth: 170,
    });
    doc.text("Highlights:", 20, 80);
    doc.text("- Blocks SQL Injection", 25, 90);
    doc.text("- Prevents Cross-Site Scripting", 25, 100);
    doc.text("- Real-time threat detection", 25, 110);
    doc.text("- Ensures compliance & security", 25, 120);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    recordDownload("GashaWAF.pdf", "1.3MB");
    window.open(pdfUrl);
  };

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Sanitize input to prevent XSS
    const sanitizeInput = (input: string): string => {
      return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const sanitizedValue =
      typeof value === "string" ? sanitizeInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalComputers"
          ? parseInt(sanitizedValue as string) || 0
          : sanitizedValue,
    }));

    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev } as Partial<
          Record<keyof FormData, string>
        >;
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkRateLimit()) {
      alert(t("alert_rate_limit"));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Map FormData to RequestData for RequestsContext
      const requestData = {
        fullName: formData.name,
        email: formData.email,
        company: formData.companyName,
        message: formData.message,
        companyName: formData.companyName,
        totalAgentless: formData.totalComputers.toString(),
        operatingSystem:
          `${formData.windowsOS || ""} ${formData.linuxOS || ""}`.trim() ||
          "N/A",
        osDetails: formData.architecture || "N/A",
        contactName: formData.contactPerson || "N/A",
        contactPhone: formData.contactPhone || "N/A",
        website: "N/A",
        officeNumber: formData.officeNumber || "N/A",
        jobTitle: formData.jobTitle || "N/A",
        department: formData.department || "N/A",
        type: `${currentProduct.replace("Gasha ", "")} Request`,
      };

      // Add request to context
      addRequest(requestData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(t("alert_request_thank_you"));

      closeModal();
    } catch (error) {
      console.error("Form submission error:", error);
      alert(t("alert_request_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      companyName: "",
      totalComputers: 0,
      linuxOS: "",
      windowsOS: "",
      contactPerson: "",
      contactPhone: "",
      jobTitle: "",
      officeNumber: "",
      department: "",
      architecture: "",
      message: "",
      product: "",
    });
    setFormErrors({});
    closeModal();
  };

  // Modal handlers
  const openModal = (product: string) => {
    setCurrentProduct(product);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  // Text rotation handler (for VPN section only button)
  const handleNextText = () => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentTextIndex((prev) => (prev + 1) % paragraphOptions.length);
          gsap.to(textRef.current!, { opacity: 1, duration: 0.3 });
        },
      });
    }
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fade-in",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power3.out" }
      );

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

      gsap.from(".waf-fade", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".waf-fade",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (showModal && modalRef.current) {
        gsap.from(modalRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [showModal]);

  // Auto-rotate text (drives both VPN + WAF descriptions)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % paragraphOptions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const ShieldIcon = () => (
    <svg
      className="w-4 h-4 md:w-5 md:h-5 text-[#00E0FF] flex-shrink-0 mt-1"
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
    <div ref={sectionRef} className="w-full">
      {/* ************ Gasha Antivirus ********** */}
      <div className="relative w-full min-h-screen overflow-hidden mt-16 md:mt-35">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 pb-8 md:pb-20 pt-8">
          <section className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-5xl text-white mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
              <div className="w-full lg:w-2/5 fade-in flex justify-center">
                <div className="w-full max-w-[300px] lg:max-w-none">
                  <Image
                    src={GashaAntivirus}
                    alt="Gasha Antivirus"
                    className="w-full rounded-lg shadow-lg"
                    priority
                  />
                </div>
              </div>

              <div className="w-full lg:w-3/5 fade-in">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold my-4 md:my-6 text-primary transition duration-300 hover:text-[#38BDF8] text-center lg:text-left">
                  {t("gasha_av_title")}
                </h2>
                <p className="mb-3 md:mb-4 text-sm sm:text-base leading-6 sm:leading-7 text-gray-100">
                  {t("gasha_av_desc")}
                </p>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <p className="text-gray-300 leading-5 md:leading-6 flex items-start text-xs sm:text-sm">
                    <ShieldIcon />
                    <span className="ml-2">{t("gasha_av_feat_1")}</span>
                  </p>
                  <p className="text-gray-300 leading-5 md:leading-6 flex items-start text-xs sm:text-sm">
                    <ShieldIcon />
                    <span className="ml-2">{t("gasha_av_feat_2")}</span>
                  </p>
                  <p className="text-gray-300 leading-5 md:leading-6 flex items-start text-xs sm:text-sm">
                    <ShieldIcon />
                    <span className="ml-2">{t("gasha_av_feat_3")}</span>
                  </p>
                  <p className="text-gray-300 leading-5 md:leading-6 flex items-start text-xs sm:text-sm">
                    <ShieldIcon />
                    <span className="ml-2">{t("gasha_av_feat_4")}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 fade-in">
                  <button
                    onClick={downloadAntivirusPDF}
                    className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                  >
                    {t("common_download")}
                  </button>
                  <button
                    onClick={() => openModal("Gasha Antivirus")}
                    className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                  >
                    {t("common_send_request")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ************ Gasha VPN ********** */}
      <div className="relative w-full min-h-screen overflow-hidden mt-12 md:mt-24">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-12 md:py-16">
          <div className="w-full max-w-5xl vpn-fade p-4 sm:p-6 md:p-8 rounded-xl shadow-xl flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8 lg:gap-10 bg-white/10 backdrop-blur-md mx-auto">
            <div className="w-full lg:w-2/5 animate-[float_4s_ease-in-out_infinite] order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-[300px] lg:max-w-none">
                <Image
                  src={GashVPN}
                  alt="Gasha VPN"
                  width={400}
                  height={300}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="w-full lg:w-3/5 text-white space-y-4 md:space-y-5 order-1 lg:order-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold transition duration-300 text-center lg:text-left">
                <span className="text-white">
                  {t("gasha_vpn_title").split(" ")[0]}{" "}
                </span>
                <span className="text-[#00E0FF] hover:text-[#38BDF8]">
                  {t("gasha_vpn_title").split(" ")[1]}
                </span>
              </h2>

              <p
                ref={textRef}
                className="text-xs sm:text-sm md:text-base text-gray-300 leading-5 md:leading-relaxed transition-opacity duration-500 text-center lg:text-left"
              >
                {t(
                  ["gasha_vpn_p1", "gasha_vpn_p2", "gasha_vpn_p3"][
                    currentTextIndex
                  ]
                )}
              </p>

              <div className="pt-2 md:pt-3 flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={handleNextText}
                  className="text-white border border-white rounded-full px-2 py-2 hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 text-xs w-8 h-8 flex items-center justify-center"
                >
                  →
                </button>

                <button
                  onClick={downloadVPNPDF}
                  className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                >
                  {t("common_download")}
                </button>

                <button
                  onClick={() => openModal("Gasha VPN")}
                  className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                >
                  {t("common_send_request")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ************ Gash WAF ************ */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-12 md:py-16">
          <div className="w-full max-w-5xl waf-fade bg-white/10 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-10 mx-auto">
            <div className="w-full lg:w-2/5 animate-[float_4s_ease-in-out_infinite] flex justify-center">
              <div className="w-full max-w-[280px] lg:max-w-none">
                <Image
                  src={GashaWAF}
                  alt="Gasha WAF"
                  width={300}
                  height={300}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="w-full lg:w-3/5 text-white space-y-4 md:space-y-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary transition duration-300 hover:text-[#38BDF8] text-center lg:text-left">
                {t("gasha_waf_title")}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-5 md:leading-relaxed transition-opacity duration-500 text-center lg:text-left">
                {t(
                  ["gasha_waf_p1", "gasha_waf_p2", "gasha_waf_p3"][
                    currentTextIndex
                  ]
                )}
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={downloadWAFPDF}
                  className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                >
                  {t("common_download")}
                </button>
                <button
                  onClick={() => openModal("Gasha WAF")}
                  className="text-white border border-white rounded-md px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300 whitespace-nowrap"
                >
                  {t("common_send_request")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-scrollbar">
          <div
            ref={modalRef}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-4 sm:p-6 relative border border-gray-700 overflow-y-auto no-scrollbar"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">
              {t("request_title_prefix")} {currentProduct}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CSRF Protection (hidden field) */}
              <input type="hidden" name="csrfToken" value={csrfToken} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_full_name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    required
                    maxLength={50}
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Company Information */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_company_name")} *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    required
                    maxLength={100}
                  />
                  {formErrors.companyName && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_total_computers")}
                  </label>
                  <input
                    type="number"
                    name="totalComputers"
                    value={formData.totalComputers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    min="0"
                    max="10000"
                  />
                  {formErrors.totalComputers && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.totalComputers}
                    </p>
                  )}
                </div>

                {/* Operating Systems */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_operating_system")} (Windows)
                  </label>
                  <input
                    type="text"
                    name="windowsOS"
                    value={formData.windowsOS}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder={t("form_os_windows_placeholder")}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_operating_system")} (Linux)
                  </label>
                  <input
                    type="text"
                    name="linuxOS"
                    value={formData.linuxOS}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder={t("form_os_linux_placeholder")}
                    maxLength={50}
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_contact_name")}
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_contact_phone")}
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  {formErrors.contactPhone && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.contactPhone}
                    </p>
                  )}
                </div>

                {/* Job Information */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_job_title")}
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_office_number")}
                  </label>
                  <input
                    type="text"
                    name="officeNumber"
                    value={formData.officeNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    maxLength={20}
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_department")}
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    {t("form_os_architecture")}
                  </label>
                  <select
                    name="architecture"
                    value={formData.architecture}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  >
                    <option value="">{t("form_select_architecture")}</option>
                    <option value="32-bit">{t("option_32_bit")}</option>
                    <option value="64-bit">{t("option_64_bit")}</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                  {t("form_message")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t("form_message_placeholder")}
                  maxLength={500}
                />
                {formErrors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <input type="hidden" name="product" value={currentProduct} />

              {/* Form Footer */}
              <div className="flex flex-wrap justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                >
                  {t("common_cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isSubmitting
                    ? t("common_submitting")
                    : t("common_send_request")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @media (max-width: 640px) {
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        }
      `}</style>
    </div>
  );
}

export default Gasha;
