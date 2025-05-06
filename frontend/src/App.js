import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { ptBR } from '@mui/material/locale';
import { ThemeProvider } from "./context/DarkMode";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [locale, setLocale] = useState();

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    if (i18nlocale) {
      const browserLocale =
        i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

      if (browserLocale === "ptBR") {
        setLocale(ptBR);
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <Routes />
      <ToastContainer 
        autoClose={3000} 
        theme="colored" 
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default App;
