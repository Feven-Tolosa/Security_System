"use client";

import Image from "next/image";
import INSAlogo from "../public/image/INSA_Logo.png";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer
      className="relative w-full bg-gray-950 text-white py-10 border-t border-primary"
      style={{
        boxShadow: "0 -1px 50px rgba(0, 255, 255, 0.5)", // Glowing top border
      }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* 🔹 Column 1: Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Shield Icon */}
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-primary">
              {t("footer_company_name")}
            </h3>
          </div>
          <p className="text-gray-400">{t("footer_company_tagline")}</p>
          <div className="flex items-center gap-2">
            {/* INSA LOGO */}
            <Link href="https://www.insa.gov.et/" target="_blank">
              <Image src={INSAlogo} alt="INSA Logo" width={60} height={60} />
            </Link>
            <p className="hover:text-primary transition duration-300">
              {t("footer_insa_name")}
            </p>
          </div>
        </div>

        {/*  Column 2: Quick Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Compass Icon */}
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 9l-4 2-2 4 4-2 2-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-primary">
              {t("footer_quick_links")}
            </h3>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="#products"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_products")}
              </Link>
            </li>
            <li>
              <Link
                href="#solutions"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_solutions")}
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_contact")}
              </Link>
            </li>
            <li>
              <Link
                href="#privacy"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_privacy")}
              </Link>
            </li>
          </ul>
        </div>

        {/* 🔹 Column 3: Contact & Social */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Phone Icon */}
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-primary">
              {t("footer_connect")}
            </h3>
          </div>
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center gap-2">
              {/* Location Icon */}
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>{t("footer_location")}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Phone Icon */}
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22 16.92V21a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h4.09a2 2 0 012 1.72c.12.81.37 1.6.72 2.34a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.74.35 1.53.6 2.34.72a2 2 0 011.72 2z" />
              </svg>
              <Link
                href="tel:+251911123456"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_phone")}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {/* Mail Icon */}
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" />
              </svg>
              <Link
                href="mailto:support@cybersecure.com"
                className="hover:text-primary transition duration-300"
              >
                {t("footer_email")}
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-2">
            <Link
              href="https://www.linkedin.com/company/information-network-security-agency/posts/?feedView=all"
              target="_blank"
              className="hover:text-primary transition duration-300"
            >
              {t("footer_social_twitter")}
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition duration-300"
            >
              {t("footer_social_linkedin")}
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Bar */}
      <div className="mt-10 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} {t("footer_copyright")}
      </div>
    </footer>
  );
};

export default Footer;
