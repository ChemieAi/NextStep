import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError("E-posta ya da şifre yanlış!");
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] flex flex-col justify-center items-center dark:bg-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm text-center mt-12 mb-16 max-md:p-4"
      >
        <img src="/favicon.svg" alt="Logo" className="h-12 mx-auto mb-6 mt-8" />

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-black"
        >
          <h2 className="text-lg font-semibold text-center mb-4 text-white">
            Hoş Geldiniz
          </h2>
          <p className="text-center text-white mb-4">Hesabınıza giriş yapınız</p>

          <input
            name="email"
            type="email"
            placeholder="Email adresinizi giriniz"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Şifrenizi giriniz"
            value={form.password}
            onChange={handleChange}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button type="submit" className="btn w-full">
            Giriş yap
          </button>
          <p className="text-center mt-4 mb-2 text-sm text-white underline cursor-pointer">
            <a href="/register">Hesabınız yok mu? Üye olun</a>
          </p>
          <Link
            to="/forgot-password"
            className="text-white underline text-sm text-center block mt-4"
          >
            Şifremi unuttum
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
