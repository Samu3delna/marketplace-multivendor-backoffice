import React, { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "", // Simplificado a una sola imagen por ahora
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        image:
          productToEdit.images && productToEdit.images.length > 0
            ? productToEdit.images[0]
            : "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es muy pesada. Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: [formData.image],
    };
    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h2>{productToEdit ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Deportes">Deportes</option>
              <option value="Libros">Libros</option>
            </select>
          </div>

          <div className="form-group">
            <label>Imagen del Producto</label>
            <div className="image-upload-sections">
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-upload-input"
                  className="hidden-input"
                />
                <label
                  htmlFor="file-upload-input"
                  className="btn btn-secondary btn-block"
                >
                  📂 Seleccionar del equipo
                </label>
              </div>

              <div className="url-upload mt-2">
                <input
                  type="url"
                  name="image"
                  value={
                    formData.image && formData.image.startsWith("data:")
                      ? ""
                      : formData.image
                  }
                  onChange={handleChange}
                  placeholder="O pega una URL de imagen aquí"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {formData.image && (
            <div className="image-preview-container">
              <img
                src={formData.image}
                alt="Vista previa"
                className="img-preview"
              />
              <button
                type="button"
                className="btn-remove-img"
                onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
              >
                Eliminar
              </button>
            </div>
          )}

          <div className="modal-actions mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {productToEdit ? "Actualizar" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
