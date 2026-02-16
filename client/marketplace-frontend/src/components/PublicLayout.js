import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const PublicLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Inicia cerrado en público

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="public-layout">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        {user && <Sidebar isOpen={sidebarOpen} />}
        <main
          className={`public-main-content ${user && !sidebarOpen ? "main-expanded" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
