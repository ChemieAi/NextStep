import React from "react";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";

const App = () => {
  return (
      <div className="bg-background text-text min-h-screen font-sans">
        <Navbar />
        <AppRouter />
      </div>
  );
};

export default App;
