import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: t('contact.title'),
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { ...form, title: t('contact.title') }, // Güncel çeviriyle title
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setStatus("success");
        setForm({
          title: t('contact.title'),
          name: '',
          email: '',
          message: ''
        });
      })
      .catch(() => setStatus("error"));
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] dark:bg-gray-900 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {t('contact.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder={t('contact.name')}
            required
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder={t('contact.email')}
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <textarea
            name="message"
            rows="5"
            placeholder={t('contact.message')}
            required
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded transition"
          >
            {t('contact.submit')}
          </button>
        </form>

        {status === "success" && (
          <p className="text-green-500 text-center mt-4">{t('contact.success')}</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-center mt-4">{t('contact.error')}</p>
        )}
      </motion.div>
    </div>
  );
};

export default Contact;
