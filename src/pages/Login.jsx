import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

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
      navigate("/cv-builder");
    } catch (err) {
      setError("E-posta ya da şifre yanlış!");
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] flex flex-col justify-center items-center dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 dark:text-white">LOGO</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm dark:bg-gray-800 dark:text-black"
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

        <button type="submit" className="btn w-full">Giriş yap</button>

        <p className="text-center mt-4 text-sm text-white underline cursor-pointer">
          Şifremi unuttum
        </p>
      </form>
    </div>
  );
};

export default Login;
