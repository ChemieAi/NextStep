import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FormProvider } from "./context/FormContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FormProvider> {/* ✅ FormProvider en DIŞTA olacak */}
        <AuthProvider> {/* ✅ useForm burada güvenle çağrılabilir */}
          <App />
        </AuthProvider>
      </FormProvider>
    </BrowserRouter>
  </React.StrictMode>
);
