import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import UserTable from "../components/UserTable";
import RoleModal from "../components/RoleModal";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import api from "../services/api";
import productService from "../services/productService";
import { FiUsers, FiPackage, FiShoppingBag, FiStar } from "react-icons/fi";

const DashboardAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "users";

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes] = await Promise.all([
        api.get("/admin/users"),
        productService.getProducts(), // Admin ve todos
      ]);
      setUsers(usersRes.data?.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    totalUsers: users?.length || 0,
    usersAdmins: users?.filter((u) => u.role === "administrador").length || 0,
    usersVendors: users?.filter((u) => u.role === "vendedor").length || 0,
    totalProducts: products?.length || 0,
  };

  // --- User Management ---
  const handleEditRole = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (newRole) => {
    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, { role: newRole });
      setIsRoleModalOpen(false);
      fetchData(); // Recargar datos
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchData();
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert(error.response?.data?.message || "Error al eliminar usuario");
      }
    }
  };

  // --- Product Management (Admin) ---
  const handleDeleteProduct = async (id) => {
    if (
      window.confirm(
        "¿Seguro que deseas eliminar este producto? (Acción de Admin)",
      )
    ) {
      try {
        await productService.deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error("Error eliminando producto:", error);
        alert("Error al eliminar producto");
      }
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        await productService.updateProduct(currentProduct._id, productData);
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error al guardar producto");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard fade-in-up">
        <div className="dashboard-header border-bottom pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Consola de Control
              </h1>
              <p className="text-muted">
                Centro de mando del ecosistema multivendor
              </p>
            </div>
            <div className="admin-status-indicator flex items-center gap-2">
              <span className="pulse-dot"></span>
              <span className="text-sm font-semibold text-green-400">
                Sistema Online
              </span>
            </div>
          </div>
        </div>

        <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card admin-stat-card">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-info">
              <p className="stat-label">Usuarios Totales</p>
              <h3>{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-icon">
              <FiPackage />
            </div>
            <div className="stat-info">
              <p className="stat-label">Catálogo Global</p>
              <h3>{stats.totalProducts}</h3>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-icon">
              <FiShoppingBag />
            </div>
            <div className="stat-info">
              <p className="stat-label">Vendedores</p>
              <h3>{stats.usersVendors}</h3>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-icon">
              <FiStar />
            </div>
            <div className="stat-info">
              <p className="stat-label">Admins</p>
              <h3>{stats.usersAdmins}</h3>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-900/50 p-1 rounded-lg w-fit mb-6 border border-white/5">
          <button
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === "users" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("users")}
          >
            Gestión de Usuarios
          </button>
          <button
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === "products" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("products")}
          >
            Gestión de Productos
          </button>
        </div>

        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card admin-card">
              <div className="card-header border-bottom mb-4">
                <h2 className="text-xl font-bold">Actividad de Usuarios</h2>
              </div>
              <div className="h-64 flex items-center justify-center text-muted">
                [ Gráfico de actividad mockup ]
              </div>
            </div>
            <div className="card admin-card">
              <div className="card-header border-bottom mb-4">
                <h2 className="text-xl font-bold">Ingresos Globales</h2>
              </div>
              <div className="h-64 flex items-center justify-center text-muted">
                [ Gráfico de ingresos mockup ]
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="card admin-card fade-in">
            <div className="card-header flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="form-select bg-gray-800 border-none px-4 py-2 w-64"
                />
                <button className="btn btn-primary px-4 py-2">
                  + Nuevo Admin
                </button>
              </div>
            </div>
            <UserTable
              users={users}
              onEditRole={handleEditRole}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        )}

        {activeTab === "products" && (
          <div className="card admin-card fade-in">
            <div className="card-header flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Inventario Global de Productos
              </h2>
              <button className="btn btn-secondary px-4 py-2">
                Exportar CSV
              </button>
            </div>
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="card admin-card fade-in">
            <div className="card-header mb-6">
              <h2 className="text-xl font-bold">Pedidos Globales</h2>
            </div>
            <div className="text-center py-20 text-muted">
              <FiShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
              <p>Cargando transacciones en tiempo real...</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <div className="card admin-card mb-6">
              <h2 className="text-xl font-bold mb-6">
                Configuración del Marketplace
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Modo Mantenimiento</p>
                    <p className="text-sm text-muted">
                      Desactiva el acceso público al marketplace
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-gray-700 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Registro de Vendedores</p>
                    <p className="text-sm text-muted">
                      Permitir que nuevos usuarios se registren como vendedores
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-cyan-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <button className="btn btn-primary w-full">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
        {isRoleModalOpen && (
          <RoleModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            currentUser={selectedUser}
            onSave={handleSaveRole}
          />
        )}

        {isProductModalOpen && (
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            onSave={handleSaveProduct}
            productToEdit={currentProduct}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
