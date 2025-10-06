// components/NisirSIEMSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import nisir_dark from "../../public/image/nisir_dark.png";
import Nisir from "../../public/image/Nisir.png";
import { useRequests } from "@/contexts/RequestsContext";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function NisirSIEMSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { addRequest } = useRequests();

  const paragraphOptions = [t("nisir_p1"), t("nisir_p2"), t("nisir_p3")];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".siem-fade", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".siem-fade",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted]);

  const RequestForm = () => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      company: "",
      message: "",
      companyName: "",
      totalAgentless: "",
      operatingSystem: "",
      osDetails: "",
      contactName: "",
      contactPhone: "",
      website: "",
      officeNumber: "",
      jobTitle: "",
      department: "",
    });

    const formRef = useRef<HTMLDivElement>(null);

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Validate required fields
      if (!formData.fullName || !formData.email) {
        alert("Please fill in all required fields (Name and Email)");
        return;
      }

      addRequest(formData);
      setShowRequestForm(false);
      alert("Your request has been submitted successfully!");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        company: "",
        message: "",
        companyName: "",
        totalAgentless: "",
        operatingSystem: "",
        osDetails: "",
        contactName: "",
        contactPhone: "",
        website: "",
        officeNumber: "",
        jobTitle: "",
        department: "",
      });
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          formRef.current &&
          !formRef.current.contains(event.target as Node)
        ) {
          setShowRequestForm(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4 ">
        <div
          ref={formRef}
          className="relative w-full max-w-4xl mx-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col "
        >
          {/* Form Header with Close Button */}
          <div className="p-4 sm:p-6 pb-0 flex justify-between items-start sticky top-0 bg-gradient-to-br from-gray-800 to-gray-900 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Request Nisir SIEM
            </h2>
            <button
              onClick={() => setShowRequestForm(false)}
              className="text-gray-500 hover:text-gray-300 focus:outline-none"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto w-full relative p-4 sm:p-6 flex-1 no-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-medium text-white text-sm sm:text-base">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-xs sm:text-sm font-medium text-gray-500"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 text-sm sm:text-base rounded-md focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-500"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block text-xs sm:text-sm font-medium text-gray-500"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-medium text-gray-300 text-sm sm:text-base">
                  Company Details
                </h3>
                <div className="space-y-2">
                  <label
                    htmlFor="companyName"
                    className="block text-xs sm:text-sm font-medium text-gray-500"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 text-sm sm:text-base focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="totalAgentless"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Total Agentless
                    </label>
                    <input
                      type="number"
                      id="totalAgentless"
                      name="totalAgentless"
                      value={formData.totalAgentless}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contactName"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Contact Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-medium text-gray-300 text-sm sm:text-base">
                  Technical Details
                </h3>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">
                    Operating System
                  </label>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {["Windows", "Mac", "Linux"].map((os) => (
                      <label key={os} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="operatingSystem"
                          value={os}
                          checked={formData.operatingSystem === os}
                          onChange={handleChange}
                          className="h-4 w-4 text-secondary-600 focus:border-secondary bg-gray-700 border border-gray-400"
                        />
                        <span className="text-xs sm:text-sm text-gray-500">
                          {os}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">
                    OS Architecture
                  </label>
                  <div className="flex gap-3 sm:gap-4">
                    {["32-bit", "64-bit"].map((bit) => (
                      <label key={bit} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="osDetails"
                          value={bit}
                          checked={formData.osDetails === bit}
                          onChange={handleChange}
                          className="h-4 w-4 text-secondary-600 focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400"
                        />
                        <span className="text-xs sm:text-sm text-gray-500">
                          {bit}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-medium text-gray-300 text-sm sm:text-base">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="contactPhone"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="website"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base border bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="officeNumber"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Office Number
                    </label>
                    <input
                      type="text"
                      id="officeNumber"
                      name="officeNumber"
                      value={formData.officeNumber}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="jobTitle"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="department"
                      className="block text-xs sm:text-sm font-medium text-gray-500"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-medium text-gray-500"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your needs..."
                  rows={4}
                  className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                />
              </div>
            </form>
          </div>

          {/* Form Footer */}
          <div className="p-3 sm:p-4 border-t bg-gradient-to-br from-gray-800 to-gray-900 sticky bottom-0">
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 text-xs sm:text-sm text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                {t("common_cancel")}
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 text-xs sm:text-sm bg-primary text-white rounded-md hover:bg-secondary transition-colors"
              >
                {t("common_submit_request")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Don't render anything until component is mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden rounded-md mb-20 mt-28"
      />
    );
  }

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden rounded-md mb-20 mt-28"
    >
      {/* 🔹 Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center px-4 sm:px-6 py-8 md:py-10">
        <div className="w-full max-w-6xl siem-fade p-4 sm:p-6 rounded-xl shadow-xl flex flex-col lg:flex-row items-center gap-6 md:gap-8 bg-white/10 backdrop-blur-md">
          {/* Image Section - Hidden on mobile, visible on larger screens */}
          <div className="w-full lg:w-2/5 flex justify-center items-center">
            <div className="max-w-xs sm:max-w-sm md:max-w-md w-full">
              <Image
                src={Nisir}
                alt="Nisir SIEM"
                width={500}
                height={300}
                className="w-full rounded-lg shadow-lg rotate-animation"
                priority={false}
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-3/5 text-white space-y-4">
            {/* 🔹 Heading with larger image in front of SIEM */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white flex items-center gap-3 sm:gap-4">
              <Image
                src={nisir_dark}
                alt="SIEM Icon"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                style={{ verticalAlign: "middle" }}
              />
              {t("nisir_heading")}
            </h2>

            <button
              onClick={() => setShowRequestForm(true)}
              className="rounded-md px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold shadow-sm transition-colors duration-200 bg-primary text-white hover:bg-secondary"
            >
              {t("common_send_request")}
            </button>

            {/* Icon + Paragraphs */}
            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              {paragraphOptions.map((text, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E0FF] flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"></path>
                  </svg>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Show the request form when state is true */}
      {showRequestForm && <RequestForm />}

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes rotateLR {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-5deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .rotate-animation {
          animation: rotateLR 6s ease-in-out infinite;
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

export default NisirSIEMSection;
