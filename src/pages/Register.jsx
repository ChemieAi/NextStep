import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        surname: form.surname,
        email: form.email,
        createdAt: new Date(),
      });

      navigate("/cv-builder");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">LOGO</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#cbc2c2] p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold text-center mb-4 text-white">
          Hoş Geldiniz
        </h2>
        <p className="text-center text-white mb-4">Hesabınızı oluşturunuz</p>

        <input
          name="name"
          placeholder="Adınızı giriniz"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="surname"
          placeholder="Soyadınızı giriniz"
          value={form.surname}
          onChange={handleChange}
        />
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

        <button type="submit" className="btn w-full">Üye Ol</button>

        <p className="text-center mt-4 text-sm text-white underline cursor-pointer">
          Zaten hesabınız var mı? <a href="/login">Giriş yap</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
