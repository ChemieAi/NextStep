import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setPasswordError(t("register.passwordMismatch") || "Passwords do not match.");
      return;
    }
    setPasswordError("");

    if (!form.agree) {
      setAgreeError(t("register.mustAgree") || "You must accept the terms to continue.");
      return;
    }
    setAgreeError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await sendEmailVerification(userCredential.user);

      localStorage.setItem("temp_user_data", JSON.stringify({
        name: form.name,
        surname: form.surname,
        agreedToTerms: true,
      }));

      navigate("/verify-waiting");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] dark:bg-gray-900 dark:text-white flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm p-4 mt-12 mb-16"
      >
        <img src="/favicon.svg" alt="Logo" className="h-12 mx-auto mb-6" />

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-lg font-semibold text-center mb-4">{t("register.welcome")}</h2>
          <p className="text-center mb-4">{t("register.subtitle")}</p>

          {["name", "surname", "email", "password", "confirmPassword"].map((field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={t(`register.${field}`)}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-3 mb-3 rounded text-black"
            />
          ))}

          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

          <div className="flex items-start mt-4 mb-6">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1 mr-2 w-5 h-5"
            />
            <label className="text-sm">
              <Trans i18nKey="register.agreementText"
                components={{
                  terms: <span onClick={() => setShowTerms(true)} className="underline text-green-300 cursor-pointer" />,
                  privacy: <span onClick={() => setShowPrivacy(true)} className="underline text-green-300 cursor-pointer" />
                }}
              />
            </label>
          </div>

          {agreeError && <p className="text-red-500 text-sm mb-2">{agreeError}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button type="submit" className="btn w-full bg-green-500 hover:bg-green-600 py-2 rounded text-white font-semibold">
            {t("register.submit")}
          </button>

          <p className="text-center mt-4 text-sm underline">
            <a href="/login">{t("register.haveAccount")}</a>
          </p>
        </form>
      </motion.div>

      {/* Terms Modal */}
      {showTerms && (
        <Modal title={t("termsAndPrivacy.termsTitle")} data={t("termsAndPrivacy.terms", { returnObjects: true })} onClose={() => setShowTerms(false)} />
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <Modal title={t("privacyTitle")} data={t("sections", { returnObjects: true })} onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
};

const Modal = ({ title, data, onClose }) => {
  const { t } = useTranslation(); // burada eklenmeli

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white text-gray-800 p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {Array.isArray(data) && data.map((section, i) => (
          <div key={i} className="mb-4">
            <strong>{section.title}</strong>
            {section.content && <p className="text-sm mt-1">{section.content}</p>}
            {section.list && (
              <ul className="list-disc ml-6 text-sm mt-1 space-y-1">
                {section.list.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
        <button onClick={onClose} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          {t("modal.button")}
        </button>
      </div>
    </div>
  );
};

export default Register;
