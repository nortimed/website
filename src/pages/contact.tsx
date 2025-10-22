import React from "react";
import ContactForm from "../components/ContactForm";

const ContactPage: React.FC = () => (
  <>
    <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-white">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Contact Us
        </h1>
        <ContactForm />
      </div>
    </main>
  </>
);

export default ContactPage;
