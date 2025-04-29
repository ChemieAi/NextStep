import { useEffect, useState } from "react";
import { useForm } from "../context/FormContext";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

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
import { Navigate } from "react-router-dom";

const stepsConfig = [
  { label: "Temel Bilgiler", icon: UserCircleIcon, component: StepBasicInfo },
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


  if (currentUser === undefined) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (!currentUser || !isMounted) return;
  
      try {
        const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");
        const cvSnap = await getDoc(cvRef);
  
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const profileImage = userSnap.exists() ? userSnap.data().profileImage : "";
  
        if (cvSnap.exists()) {
          setFormData({ ...cvSnap.data(), profileImage }); // ✅
        } else {
          setFormData({
            name: "",
            title: "",
            email: "",
            phone: "",
            city: "",
            education: [],
            experience: [],
            socials: [],
            skills: [],
            languages: [],
            projects: [],
            profileImage, // ✅
          });
        }
      } catch (err) {
        console.error("CV verisi alınamadı ❌", err);
      }
    };
  
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentUser, setFormData]);
  

  const saveToFirebase = async () => {
    if (!currentUser) return;
    try {
      const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");
      await setDoc(cvRef, { ...formData, updatedAt: new Date() });
    } catch (error) {
      console.error("CV kaydedilirken hata ❌", error);
    }
  };

  const CurrentStepComponent = stepsConfig[step].component;
  const handleNext = () => {
    if (step === stepsConfig.length - 2) {
      // Şablona geçmeden önce veriyi kaydet
      saveToFirebase();
    }

    if (step === stepsConfig.length - 1) {
      // Son adımda preview sayfasına yönlendir
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl p-6">
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

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-40 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Geri
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {step === stepsConfig.length - 1 ? "Tamamla" : "İleri"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CvBuilder;
