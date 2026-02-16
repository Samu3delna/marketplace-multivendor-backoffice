import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUsers,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiShield,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-header">
        <div className="admin-badge">
          <FiShield />
          <span>MATERIO ADMIN</span>
        </div>
      </div>

      <div className="sidebar-user-brief">
        <div className="user-avatar-admin">
          {user?.nombre?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="user-info-admin">
          <p className="user-name-admin">{user?.nombre}</p>
          <p className="user-role-admin">Administrador Principal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Principal</div>
        <NavLink
          to="/admin/dashboard?tab=users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "admin-link-active" : ""}`
          }
        >
          <FiUsers /> <span>Usuarios</span>
        </NavLink>

        <NavLink
          to="/admin/dashboard?tab=products"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "admin-link-active" : ""}`
          }
        >
          <FiPackage /> <span>Productos Globales</span>
        </NavLink>

        <div className="sidebar-section-title">Análisis</div>
        <NavLink
          to="/admin/dashboard?tab=orders"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "admin-link-active" : ""}`
          }
        >
          <FiShoppingBag /> <span>Ventas Totales</span>
        </NavLink>

        <div className="sidebar-section-title">Configuración</div>
        <NavLink
          to="/admin/dashboard?tab=settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "admin-link-active" : ""}`
          }
        >
          <FiSettings /> <span>Ajustes del Sistema</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">Premium Dashboard v3.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
