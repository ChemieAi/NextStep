// components/RouteChangeLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteChangeLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600); // 0.6 - 1 saniye beklet

    return () => clearTimeout(timer);
  }, [location.pathname]); // Sayfa değişince tetiklenir

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteChangeLoader;
