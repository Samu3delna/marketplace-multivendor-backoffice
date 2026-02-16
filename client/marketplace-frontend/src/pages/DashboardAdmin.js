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
    usersClients: users?.filter((u) => u.role === "cliente").length || 0,
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
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                Dashboard Administrativo
              </h1>
              <p className="text-secondary text-lg">
                Visión general y gestión de todo el ecosistema.
              </p>
            </div>
            <div className="admin-status-indicator flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
              <span className="pulse-dot"></span>
              <span className="text-sm font-bold text-gray-700">
                Sistema Activo
              </span>
            </div>
          </div>
        </div>

        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card premium-card-purple">
            <div className="stat-icon-bg">
              <FiUsers />
            </div>
            <div className="stat-content">
              <p className="stat-label">Vendedores</p>
              <h3>{stats.usersVendors}</h3>
              <span className="stat-trend success">+2.5% hoy</span>
            </div>
          </div>
          <div className="stat-card premium-card-orange">
            <div className="stat-icon-bg">
              <FiUsers />
            </div>
            <div className="stat-content">
              <p className="stat-label">Clientes</p>
              <h3>{stats.usersClients}</h3>
              <span className="stat-trend success">+1.2% hoy</span>
            </div>
          </div>
          <div className="stat-card premium-card-blue">
            <div className="stat-icon-bg">
              <FiPackage />
            </div>
            <div className="stat-content">
              <p className="stat-label">Catálogo Global</p>
              <h3>{stats.totalProducts}</h3>
              <span className="stat-trend neutral">Sin cambios</span>
            </div>
          </div>
          <div className="stat-card premium-card-green">
            <div className="stat-icon-bg">
              <FiStar />
            </div>
            <div className="stat-content">
              <p className="stat-label">Administradores</p>
              <h3>{stats.usersAdmins}</h3>
              <span className="stat-trend neutral">Personal core</span>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-1 rounded-lg w-fit mb-8 shadow-sm border border-gray-100">
          <button
            className={`px-8 py-2.5 rounded-md font-bold transition-all ${activeTab === "users" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:text-purple-600"}`}
            onClick={() => setActiveTab("users")}
          >
            Gestión de Usuarios
          </button>
          <button
            className={`px-8 py-2.5 rounded-md font-bold transition-all ${activeTab === "products" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:text-purple-600"}`}
            onClick={() => setActiveTab("products")}
          >
            Catálogo Global
          </button>
        </div>

        {activeTab === "users" && (
          <div className="admin-card fade-in">
            <div className="card-header flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Control de Usuarios
                </h2>
                <p className="text-sm text-gray-500">
                  Cambia roles, promueve vendedores o elimina cuentas.
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Filtrar por nombre o email..."
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
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
          <div className="admin-card fade-in">
            <div className="card-header flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Inventario del Marketplace
                </h2>
                <p className="text-sm text-gray-500">
                  Supervisa y elimina productos de cualquier vendedor.
                </p>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition-all">
                Generar Reporte
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
