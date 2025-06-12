import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err) {
      setError("Geçerli bir e-posta adresi giriniz.");
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
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Şifremi Unuttum</h1>
        <form
          onSubmit={handleReset}
          className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <label className="block text-white mb-2">E-posta adresinizi girin</label>
          <input
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded bg-gray-50 mb-4"
          />
          <button type="submit" className="btn w-full">Gönder</button>

          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
