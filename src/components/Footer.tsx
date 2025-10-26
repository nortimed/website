import React from "react";
import { useTranslation } from "next-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation("common");
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://facebook.com/nortimed"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            {t("facebook")}
          </a>
          <a
            href="https://twitter.com/nortimed"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            {t("twitter")}
          </a>
          <a
            href="https://instagram.com/nortimed"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            {t("instagram")}
          </a>
        </div>
        <div className="mb-2">
          <p className="text-sm">
            {t("contact_us")}{" "}
            <a
              href="mailto:info@nortimed.com"
              className="underline hover:text-blue-200"
            >
              info@nortimed.com
            </a>{" "}
            |{" "}
            <a
              href="tel:+15551234567"
              className="underline hover:text-blue-200"
            >
              +1 (555) 123-4567
            </a>
          </p>
        </div>
        <p className="text-xs text-gray-200">
          &copy; {new Date().getFullYear()} {t("nortimed")}.{" "}
          {t("all_rights_reserved")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
