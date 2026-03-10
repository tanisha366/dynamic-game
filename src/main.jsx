import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./Navbar.jsx";
import Appcontextprovider from "./appcontext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Appcontextprovider>
    <BrowserRouter>
      <Navbar />
      <App />
    </BrowserRouter>
  </Appcontextprovider>,
);
