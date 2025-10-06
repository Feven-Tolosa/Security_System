"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import abis from "../../public/image/abis.png";
import { useLanguage } from "@/contexts/LanguageContext";
gsap.registerPlugin(ScrollTrigger);

const BiometricSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
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
      console.log("Form submitted:", formData);
      setShowRequestForm(false);
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault()

    //   try {
    //     const response = await fetch('/api/submit-form', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(formData),
    //     })

    //     if (!response.ok) throw new Error('Submission failed')

    //     const result = await response.json()
    //     console.log('Success:', result)
    //     setShowRequestForm(false)
    //     // Optionally show a success message to the user
    //   } catch (error) {
    //     console.error('Error:', error)
    //     // Optionally show an error message to the user
    //   }
    // }

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div
          ref={formRef}
          className="relative w-full max-w-max mx-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Form Header with Close Button */}
          <div className="p-6 pb-0 flex justify-between items-start sticky top-0 bg-gradient-to-br from-gray-800 to-gray-900 z-10">
            <h2 className="text-2xl font-bold text-white">
              Request Gasha Antivirus
            </h2>
            <button
              onClick={() => setShowRequestForm(false)}
              className="text-gray-500 hover:text-gray-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
          <div className="overflow-y-auto p-6 flex-1 no-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-white">Basic Information</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-300">Company Details</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2   focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Total Agentless
                    </label>
                    <input
                      type="number"
                      name="totalAgentless"
                      value={formData.totalAgentless}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-300">Technical Details</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Operating System
                  </label>
                  <div className="flex flex-wrap gap-4">
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
                        <span className="text-sm text-gray-500">{os}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500">
                    OS Architecture
                  </label>
                  <div className="flex gap-4">
                    {["32-bit", "64-bit"].map((bit) => (
                      <label key={bit} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="osDetails"
                          value={bit}
                          checked={formData.osDetails === bit}
                          onChange={handleChange}
                          className="h-4 w-4 text-secondary-600   focus:ring-secondary focus:border-secondary bg-gray-700 border border-gray-400"
                        />
                        <span className="text-sm text-gray-500">{bit}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-300">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-2 border   bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Office Number
                    </label>
                    <input
                      type="text"
                      name="officeNumber"
                      value={formData.officeNumber}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your needs..."
                  rows={4}
                  className="w-full p-2  bg-gray-700 border border-gray-400 rounded-md focus:ring-secondary focus:border-secondary"
                />
              </div>
            </form>
          </div>

          {/* Form Footer */}
          <div className="p-4 border-t bg-gradient-to-br from-gray-800 to-gray-900 sticky bottom-0">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2  focus:border-secondary  border border-gray-400 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                {t("common_cancel")}
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-secondary hover:bg-secondary-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary hover:bg-gray-600"
              >
                {t("common_submit_request")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="relative w-full flex justify-center items-center py-20 overflow-hidden bg-transparent mt-25">
      {/* Overlay Content */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl  bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col lg:flex-row items-center gap-10 transition-all duration-700"
      >
        {/*  Text Section */}
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

          <button
            onClick={() => setShowRequestForm(true)}
            className="rounded-md px-6 py-3 text-sm font-semibold shadow-sm transition-colors duration-200 bg-primary text-white hover:bg-secondary"
          >
            {t("common_send_request")}
          </button>
        </div>

        {/*  Image Section */}
        <div
          ref={imageRef}
          className="w-full lg:w-1/2 flex justify-center items-center lg:block sm:hidden"
        >
          <Image
            src={abis}
            alt="Biometric Protection"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      {/* Show the request form when state is true */}
      {showRequestForm && <RequestForm />}
    </div>
  );
};

export default BiometricSection;
