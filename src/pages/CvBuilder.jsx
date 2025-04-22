import { useEffect, useState } from "react";
import { useForm } from "../context/FormContext";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import StepperLayout from "../components/StepperLayout";
import StepBasicInfo from "../components/steps/StepBasicInfo";
import StepEducation from "../components/steps/StepEducation";
import StepExperience from "../components/steps/StepExperience";
import StepSocial from "../components/steps/StepSocial";
import StepSkills from "../components/steps/StepSkills";
import StepProjects from "../components/steps/StepProjects";
import StepTemplate from "../components/steps/StepTemplate";
import { Navigate } from "react-router-dom";

const CvBuilder = () => {
  const [step, setStep] = useState(0);
  const { formData, setFormData } = useForm();
  const { currentUser } = useAuth();

  // currentUser kontrolü
  if (currentUser === undefined) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!currentUser || !isMounted) return;

      try {
        const docRef = doc(db, "users", currentUser.uid, "cvs", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
          console.log("Kullanıcının CV verisi yüklendi 🔄");
        } else {
          console.log("Bu kullanıcı için CV bulunamadı.");
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
      console.log("CV Firestore'a kaydedildi ✅");
    } catch (error) {
      console.error("CV kaydedilirken hata ❌", error);
    }
  };

  const steps = [
    <StepBasicInfo data={formData} setData={setFormData} />,
    <StepEducation data={formData} setData={setFormData} />,
    <StepExperience data={formData} setData={setFormData} />,
    <StepSocial data={formData} setData={setFormData} />,
    <StepSkills data={formData} setData={setFormData} />,
    <StepProjects data={formData} setData={setFormData} />,
    <StepTemplate />,
  ];

  const handleNext = () => {
    if (step === steps.length - 2) {
      saveToFirebase();
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  return (
    <StepperLayout
      currentStep={step}
      onNext={handleNext}
      onBack={() => setStep((prev) => Math.max(prev - 1, 0))}
    >
      {steps[step]}
    </StepperLayout>
  );
};

export default CvBuilder;
