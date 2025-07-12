import { useState } from "react";
import { auth } from "../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setMessage(t("updatePassword.success"));
    } catch (err) {
      setMessage(t("updatePassword.error"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col justify-center items-center p-6 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">{t("updatePassword.title")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("updatePassword.current")}
            required
            className="input w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("updatePassword.new")}
            required
            className="input w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          <button className="btn w-full bg-green-600 text-white">{t("updatePassword.button")}</button>
          {message && <p className="text-center mt-3 text-sm text-red-600">{message}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePassword;
