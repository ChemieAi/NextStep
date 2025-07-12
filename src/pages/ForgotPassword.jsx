import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(t("forgotPassword.success"));
    } catch (err) {
      setError(t("forgotPassword.error"));
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] flex flex-col justify-center items-center dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          {t("forgotPassword.title")}
        </h1>
        <form
          onSubmit={handleReset}
          className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <label className="block text-white mb-2">
            {t("forgotPassword.instruction")}
          </label>
          <input
            type="email"
            placeholder={t("forgotPassword.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded bg-gray-50 mb-4 text-black"
          />
          <button type="submit" className="btn w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition">
            {t("forgotPassword.submit")}
          </button>

          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
