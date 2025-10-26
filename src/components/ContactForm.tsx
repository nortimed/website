import React, { useState } from "react";
import { Input } from "./ui/input";
import { EmailInput } from "./ui/email-input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useTranslation } from "next-i18next";

const ContactForm: React.FC = () => {
  const { t } = useTranslation("common");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const MESSAGE_MAX = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !message) {
      setError(t("all_fields_required"));
      return;
    }
    if (message.length > MESSAGE_MAX) {
      setError(t("message_too_long", { max: MESSAGE_MAX }));
      return;
    }

    // Here you would typically handle the form submission, e.g., sending data to an API
    console.log({ name, email, message });
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="py-16 px-4 bg-white">
      <div className="max-w-lg mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-2">{t("message_sent")}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("name")}
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("email")}
            </label>
            <EmailInput id="email" value={email} onChange={setEmail} required />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("message")}
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MESSAGE_MAX) {
                  setMessage(e.target.value);
                }
              }}
              maxLength={MESSAGE_MAX}
              required
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {message.length}/{MESSAGE_MAX}
            </div>
          </div>
          <Button type="submit" className="w-full py-3 font-semibold">
            {t("send_message")}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
