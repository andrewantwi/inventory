"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TiEdit } from "react-icons/ti";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  low_stock_threshold?: number;
  price?: number;
  category_id?: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // Extract categoryId from URL
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Fixed from setproduct
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState<string>(""); // For displaying category name

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [categoryId]); // Re-fetch when categoryId changes

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (categoryId && !isNaN(Number(categoryId))) {
        // Use the category-specific endpoint
        response = await axios.get<Product[]>(
          `${baseUrl}/products/by_category_id/${categoryId}`
        );
      } else {
        // Fallback to fetching all products
        setCategoryName(""); // Clear category name if no categoryId
        response = await axios.get<Product[]>(`${baseUrl}/products/`);
      }
      setProducts(response.data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(
        error.response?.status === 404
          ? "Category not found or no products available."
          : "Failed to fetch products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<Category[]>(`${baseUrl}/categories`);
      setCategories(response.data);
      if (categoryId && !isNaN(Number(categoryId))) {
        const category = response.data.find(
          (cat) => cat.id === Number(categoryId)
        );
        setCategoryName(category ? category.name : "Unknown Category");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [name]:
          name === "quantity" ||
          name === "low_stock_threshold" ||
          name === "price" ||
          name === "category_id"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      setLoading(true);
      setError("");
      try {
        if (currentProduct.id === 0) {
          await axios.post(`${baseUrl}/products`, {
            ...currentProduct,
            category_id: categoryId ? Number(categoryId) : currentProduct.category_id,
          });
        } else {
          await axios.put(`${baseUrl}/products/${currentProduct.id}`, currentProduct);
        }
        setIsModalOpen(false);
        setCurrentProduct(null);
        fetchProducts();
      } catch (error) {
        console.error("Error saving product:", error);
        setError("Failed to save product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${baseUrl}/products/${productToDelete.id}`); // Fixed typo from /product/
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Products {categoryName ? `in ${categoryName}` : ""}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-black">Loading...</div>}
      <button
        className="btn bg-[#04D9B2] border-none text-white mb-4"
        onClick={() => {
          setCurrentProduct({
            id: 0,
            sku: "",
            name: "",
            description: "",
            quantity: 0,
            low_stock_threshold: 0,
            price: 0,
            category_id: categoryId ? Number(categoryId) : undefined,
            created_at: "",
            updated_at: "",
          });
          setIsModalOpen(true);
        }}
      >
        Add New Product
      </button>

      <table className="table w-full bg-white rounded-lg border border-gray-200 text-black">
        <thead>
          <tr className="bg-gray-100 text-left border-b border-gray-200">
            <th className="p-2">SKU</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price</th>
            <th className="p-2">Low Stock</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && !loading && (
            <tr>
              <td colSpan={8} className="p-2 text-center">
                No products found{categoryName ? ` in ${categoryName}` : ""}.
              </td>
            </tr>
          )}
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2">{product.sku}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.description || "No description"}</td>
              <td className="p-2">{product.quantity}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.low_stock_threshold}</td>
              <td className="p-2">
                {categories.find((cat) => cat.id === product.category_id)?.name ||
                  "Unknown"}
              </td>
              <td className="p-2 flex space-x-2 text-lg">
                <TiEdit
                  className="cursor-pointer text-black"
                  onClick={() => handleEditClick(product)}
                />
                <MdOutlineDeleteOutline
                  className="cursor-pointer text-[#04D9B2]"
                  onClick={() => handleDeleteClick(product)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal modal-open bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="modal-box w-full max-w-2xl bg-white p-6 rounded">
            <h3 className="text-lg font-bold mb-4">
              {currentProduct?.id === 0 ? "Add Product" : "Edit Product"}
            </h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={currentProduct?.sku || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct?.name || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <input
                  type="text"
                  name="description"
                  value={currentProduct?.description || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentProduct?.quantity || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={currentProduct?.low_stock_threshold || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Price</label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct?.price || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Category</label>
                <select
                  name="category_id"
                  value={currentProduct?.category_id || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-action flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-[#04D9B2] border-none text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Delete Product</h2> {/* Fixed title */}
            <p>Are you sure you want to delete this product?</p>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;