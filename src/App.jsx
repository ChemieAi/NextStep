import React from "react";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="bg-background text-text min-h-screen font-sans">
      <Navbar />
      <AppRouter />
      <Footer />
    </div>
  );
};

export default App;
