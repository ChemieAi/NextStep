// utils/localStorage.js
export const saveFormDataToLocal = (data) => {
    try {
      localStorage.setItem("cvFormData", JSON.stringify(data));
    } catch (err) {
      console.error("Veri localStorage'a kaydedilemedi ❌", err);
    }
  };
  
  export const getFormDataFromLocal = () => {
    try {
      const data = localStorage.getItem("cvFormData");
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("LocalStorage verisi alınamadı ❌", err);
      return null;
    }
  };
  