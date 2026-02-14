import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUsers,
  FiPackage,
  FiPieChart,
  FiSettings,
  FiShoppingBag,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const adminItems = [
    {
      path: "/admin/dashboard?tab=metrics",
      icon: <FiPieChart />,
      label: "Vista General",
    },
    {
      path: "/admin/dashboard?tab=users",
      icon: <FiUsers />,
      label: "Usuarios",
    },
    {
      path: "/admin/dashboard?tab=products",
      icon: <FiPackage />,
      label: "Productos",
    },
    {
      path: "/admin/dashboard?tab=orders",
      icon: <FiShoppingBag />,
      label: "Pedidos Globales",
    },
    {
      path: "/admin/dashboard?tab=analytics",
      icon: <FiActivity />,
      label: "Métricas",
    },
    {
      path: "/admin/dashboard?tab=settings",
      icon: <FiSettings />,
      label: "Configuración",
    },
  ];

  return (
    <aside
      className={`sidebar admin-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      <div className="sidebar-header admin-sidebar-header">
        <div className="admin-badge">
          <FiShield className="admin-badge-icon" />
          <span>ADMIN CASE</span>
        </div>
      </div>

      <div className="sidebar-user-brief">
        <div className="user-avatar-admin">
          {user?.nombre?.charAt(0) || "A"}
        </div>
        <div className="user-info-admin">
          <p className="user-name-admin">{user?.nombre}</p>
          <p className="user-role-admin">Super Administrador</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">ADMINISTRACIÓN</div>
        {adminItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link admin-link ${isActive ? "admin-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-title">SISTEMA</div>
        {adminItems.slice(4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link admin-link ${isActive ? "admin-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">Admin Console v2.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
