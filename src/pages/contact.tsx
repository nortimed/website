import React from "react";
import ContactForm from "../components/ContactForm";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ContactPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-white">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t("contact_us_page")}
          </h1>
          <ContactForm />
        </div>
      </main>
    </>
  );
};

import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default ContactPage;
