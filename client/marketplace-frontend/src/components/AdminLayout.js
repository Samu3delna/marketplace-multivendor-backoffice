import { useState } from "react";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout admin-layout">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <AdminSidebar isOpen={sidebarOpen} />
        <main
          className={`main-content admin-main-content ${sidebarOpen ? "" : "main-expanded"}`}
        >
          <div className="admin-container">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
