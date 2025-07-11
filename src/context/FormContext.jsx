import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
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
    profileImage:"",
    summary: "",
    selectedTemplate: "simple",
  });

  const resetForm = () => {
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
      profileImage:"",
      summary: "",
      selectedTemplate: "simple",
    });
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
