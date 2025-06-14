import { useEffect, useState } from "react";
import { useForm } from "../context/FormContext";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

import {
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  LinkIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

import StepBasicInfo from "../components/steps/StepBasicInfo";
import StepEducation from "../components/steps/StepEducation";
import StepExperience from "../components/steps/StepExperience";
import StepSocial from "../components/steps/StepSocial";
import StepSkills from "../components/steps/StepSkills";
import StepProjects from "../components/steps/StepProjects";
import StepTemplate from "../components/steps/StepTemplate";
import StepSummary from "../components/steps/StepSummary";

const stepsConfig = [
  { label: "Temel Bilgiler", icon: UserCircleIcon, component: StepBasicInfo },
  { label: "Özet", icon: DocumentDuplicateIcon, component: StepSummary },
  { label: "Eğitim", icon: AcademicCapIcon, component: StepEducation },
  { label: "Deneyim", icon: BriefcaseIcon, component: StepExperience },
  { label: "Sosyal Medya", icon: LinkIcon, component: StepSocial },
  { label: "Yetenekler", icon: WrenchScrewdriverIcon, component: StepSkills },
  { label: "Projeler", icon: GlobeAltIcon, component: StepProjects },
  { label: "Şablon", icon: DocumentDuplicateIcon, component: StepTemplate },
];

const CvBuilder = () => {
  const [step, setStep] = useState(0);
  const { formData, setFormData } = useForm();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (currentUser === null) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE}/api/cv`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn("CV verisi bulunamadı ❌");
          return;
        }

        const data = await response.json();

        // Profil fotoğrafını Firebase'den çekmeye devam et
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const profileImage = userSnap.exists() ? userSnap.data().profileImage : "";

        setFormData({ ...data, profileImage });
      } catch (err) {
        console.error("CV backend'den alınamadı ❌", err);
      }
    };


    fetchData();
  }, [currentUser, setFormData, navigate]);

  const saveToFirebase = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE}/api/cv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("✅ CV backend'e kaydedildi");
    } catch (error) {
      console.error("❌ Backend'e CV kaydedilirken hata:", error);
    }
  };


  const CurrentStepComponent = stepsConfig[step].component;
  const emailRegex = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneRegex = (phone) => /^\+?[1-9]\d{7,14}$/.test(phone);
  const handleNext = () => {
    // StepBasicInfo'da isek email'i kontrol et
    if (stepsConfig[step].label === "Temel Bilgiler") {
      if (!emailRegex(formData.email)) {
        alert("Lütfen geçerli bir e-posta adresi girin (örneğin: example@mail.com).");
        return;
      }
      if (!phoneRegex(formData.phone)) {
        alert("Lütfen geçerli bir telefon numarası girin (örneğin: +905551112233) Alan kodu dahil.");
        return;
      }
    }
    saveToFirebase();
    if (step === stepsConfig.length - 1) {
      navigate("/cv-preview");
      return;
    }
    setStep((prev) => Math.min(prev + 1, stepsConfig.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex justify-center items-center p-6 dark:bg-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-lg:mt-20 shadow-lg w-full max-w-5xl p-6 "
      >
        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {stepsConfig.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step === index;

            return (
              <button
                key={index}
                onClick={() => setStep(index)}
                className={`flex flex-col items-center px-3 py-2 rounded-md transition 
                ${isActive ? "text-green-600 font-semibold" : "text-gray-500 hover:text-green-600"}`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-sm">{stepItem.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <CurrentStepComponent data={formData} setData={setFormData} />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-40 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Geri
          </button>

          <p className="text-sm text-orange-500 text-center mx-auto w-full md:w-auto mt-2 mb-2 ">
            🔄 Değişikliklerin kaydolması için "İleri" butonuna basmayı unutmayın.
          </p>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700"
          >
            {step === stepsConfig.length - 1 ? "Tamamla" : "İleri"}
          </button>
        </div>
      </motion.div >
    </div >
  );
};

export default CvBuilder;
