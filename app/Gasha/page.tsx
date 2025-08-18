"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import GashaAntivirus from "../../public/image/GashAntivirus.png";
import GashVPN from "../../public/image/GashVPN.png";
import GashaWAF from "../../public/image/GashWAF.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

function Gasha() {
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

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Text rotation
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  // Product descriptions
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

  // PDF download handlers
  const downloadAntivirusPDF = () => {
    // In a real app, you would fetch the PDF from your server
    const pdfUrl = "/pdfs/gasha-antivirus.pdf"; // Update this path to your actual PDF
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Gasha-Antivirus-Documentation.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVPNPDF = () => {
    // In a real app, you would fetch the PDF from your server
    const pdfUrl = "/pdfs/gasha-vpn.pdf"; // Update this path to your actual PDF
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Gasha-VPN-Documentation.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalComputers" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, product: currentProduct });
    closeModal();
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

  // Text rotation handler
  const handleNextText = () => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentTextIndex((prev) => (prev + 1) % paragraphOptions.length);
          gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
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

  // Auto-rotate text
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
    <div ref={sectionRef}>
      {/* ************ Gasha Antivirus ********** */}
      <div className="relative w-full min-h-screen overflow-hidden mt-35">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-6 pb-20">
          <section className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl w-full max-w-6xl text-white">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/3 fade-in">
                <Image
                  src={GashaAntivirus}
                  alt="Gasha Antivirus"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="w-full lg:w-1/2 fade-in">
                <h2 className="text-3xl font-bold my-10 pt-10 text-primary transition duration-300 hover:text-[#38BDF8]">
                  Gasha Antivirus
                </h2>
                <p className="mb-6 text-lg leading-8 text-gray-100">
                  A robust and intelligent defense system designed to safeguard
                  your digital world from viruses, malware, ransomware, and
                  evolving cyber threats. With cutting-edge technology,
                  real-time protection, and advanced threat detection, it
                  ensures your data, privacy, and devices stay secure.
                </p>

                <p className="text-gray-300  leading-8 flex items-start text-large">
                  <ShieldIcon />
                  <div>
                    <strong> Real-Time Protection: </strong> Keeps desktops,
                    laptops, downloads, and external devices safe.
                  </div>
                </p>
                <p className="text-gray-300 leading-8 flex items-start text-large">
                  <ShieldIcon />
                  <div>
                    <strong>AI-Powered Detection:</strong> Protects against
                    known and unknown threats using artificial intelligence.
                  </div>
                </p>
                <p className="text-gray-300 leading-8 flex items-start text-large">
                  <ShieldIcon />
                  <div>
                    <strong>Up-to-Date Database:</strong> Regular virus
                    definition updates to counter emerging threats.
                  </div>
                </p>
                <p className="text-gray-300  flex items-start text-large">
                  <ShieldIcon />
                  <div>
                    <strong>Tamper Protection:</strong> Secures your Windows
                    registry from unauthorized changes.
                  </div>
                </p>

                <div className="mt-8 flex gap-4 fade-in">
                  <button
                    onClick={downloadAntivirusPDF}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => openModal("Gasha Antivirus")}
                    className="border border-primary text-primary px-6 py-2 rounded hover:bg-secondary hover:text-white transition"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ************ Gasha VPN ********** */}
      <div className="relative w-full min-h-screen overflow-hidden mt-24">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-6xl vpn-fade p-8 rounded-xl shadow-xl flex flex-col lg:flex-row items-center lg:items-start gap-10 bg-white/10 backdrop-blur-md">
            <div className="w-full lg:w-1/2 animate-[float_4s_ease-in-out_infinite]">
              <Image
                src={GashVPN}
                alt="Gasha VPN"
                width={600}
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full lg:w-1/2 text-white space-y-6">
              <h2 className="text-4xl font-bold transition duration-300">
                <span className="text-white">Gasha </span>
                <span className="text-[#00E0FF] hover:text-[#38BDF8]">VPN</span>
              </h2>

              <p
                ref={textRef}
                className="text-lg text-gray-300 leading-relaxed transition-opacity duration-500"
              >
                {paragraphOptions[currentTextIndex]}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={handleNextText}
                  className="text-white border border-white rounded-full px-4 py-2 hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300"
                >
                  →
                </button>

                <button
                  onClick={downloadVPNPDF}
                  className="text-white border border-white rounded-md px-6 py-3 text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300"
                >
                  Download
                </button>

                <button
                  onClick={() => openModal("Gasha VPN")}
                  className="text-white border border-white rounded-md px-6 py-3 text-sm font-semibold shadow-sm hover:bg-gradient-to-r hover:from-[#00E0FF] hover:to-gray-800 hover:text-black transition duration-300"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ************ Gash WAF ************ */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-6xl waf-fade bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-10">
            <div className="w-full lg:w-1/3 animate-[float_4s_ease-in-out_infinite]">
              <Image
                src={GashaWAF}
                alt="Gasha WAF"
                width={300}
                height={300}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full lg:w-1/2 text-white space-y-6">
              <h2 className="text-4xl font-bold text-primary transition duration-300 hover:text-[#38BDF8]">
                Gasha WAF
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed transition-opacity duration-500">
                {paragraphOptionsGASHWAF[currentTextIndex]}
              </p>
              <button
                onClick={() => openModal("Gasha WAF")}
                className="rounded-md px-6 py-3 text-sm font-semibold shadow-sm transition-colors duration-200 bg-primary text-white hover:bg-secondary"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Modal Form */}
      {showModal && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4  no-scrollbar">
          <div
            ref={modalRef}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6 relative border border-gray-700 overflow-y-auto no-scrollbar"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
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

            <h3 className="text-2xl font-bold text-white mb-6">
              Request {currentProduct}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Company Information */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Total Computers
                  </label>
                  <input
                    type="number"
                    name="totalComputers"
                    value={formData.totalComputers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>

                {/* Operating Systems */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Windows OS Version
                  </label>
                  <input
                    type="text"
                    name="windowsOS"
                    value={formData.windowsOS}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Windows 10, 11"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Linux OS Version
                  </label>
                  <input
                    type="text"
                    name="linuxOS"
                    value={formData.linuxOS}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Ubuntu 20.04, CentOS 7"
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Job Information */}
                <div>
                  <label className="block text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Office Number
                  </label>
                  <input
                    type="text"
                    name="officeNumber"
                    value={formData.officeNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-gray-300 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    System Architecture
                  </label>
                  <select
                    name="architecture"
                    value={formData.architecture}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select architecture</option>
                    <option value="32-bit">32-bit</option>
                    <option value="64-bit">64-bit</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <input type="hidden" name="product" value={currentProduct} />
              {/* Form Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                >
                  Send Request
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
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

export default Gasha;
