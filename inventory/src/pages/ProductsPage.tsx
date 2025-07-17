"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TiEdit } from "react-icons/ti";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { format, parseISO } from "date-fns"; // Import date-fns

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
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState<string>("");

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Function to format ISO date
  const formatDate = (isoDate: string) => {
    try {
      return format(parseISO(isoDate), "MMMM d, yyyy, h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (categoryId && !isNaN(Number(categoryId))) {
        response = await axios.get<Product[]>(
          `${baseUrl}/products/by_category_id/${categoryId}`
        );
      } else {
        setCategoryName("");
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
      const response = await axios.get<Category[]>(`${baseUrl}/categories/`);
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
          await axios.post(`${baseUrl}/products/`, {
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
      await axios.delete(`${baseUrl}/products/${productToDelete.id}`);
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
    <div>
     <div className="flex bg-[#181D26] items-center justify-between px-8 m-4 border-none rounded-lg">
        <div className="p-4 text-3xl text-white">Products</div>
        
      </div>

    <div className="p-4 rounded-lg border border-black m-4 bg-[#181D26]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Products {categoryName ? `in ${categoryName}` : ""}
        </h1>
        {error && <div className="text-red-500">{error}</div>}
        {loading && <div className="text-gray-200">Loading...</div>}
        <button
          className="btn bg-[#00AB56] border-none text-[#FCFFFF] mb-4"
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
      </div>

      <table className="table w-full">
        <thead>
          <tr className="border-none rounded bg-gray-600 text-white">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">SKU</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Low Stock</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Created At</th>
            <th className="p-4 text-left">Updated At</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && !loading && (
            <tr>
              <td colSpan={10} className="p-4 text-center">
                No products found{categoryName ? ` in ${categoryName}` : ""}.
              </td>
            </tr>
          )}
          {products.map((product) => (
            
            <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-700">
              <td className="p-4 text-white">{product.name}</td>
              <td className="p-4">{product.sku}</td>
              <td className="p-4">{product.description || "No description"}</td>
             <td className="p-4">
  <div
    className={`p-1 rounded-lg font-semibold border-2 ${
      (() => {
        const threshold = product.low_stock_threshold ?? 1;
        const percentage = product.quantity / threshold;

        if (percentage <= 0.2)
          return "bg-[rgba(220,38,38,0.1)] border-red-500 text-red-500";
        if (percentage <= 0.5)
          return "bg-[rgba(202,138,4,0.1)] border-yellow-500 text-yellow-500"; 
        return "bg-[rgba(22,163,74,0.1)] border-green-500 text-green-500";
      })()
    }`}
  >
    {product.quantity}
  </div>
</td>

              <td className="p-4">{product.price}</td>
              <td className="p-4">{product.low_stock_threshold}</td>
              <td className="p-4">
                {categories.find((cat) => cat.id === product.category_id)?.name || "Unknown"}
              </td>
              <td className="p-4">{formatDate(product.created_at)}</td>
              <td className="p-4">{formatDate(product.updated_at)}</td>
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-pointer text-[#03A64A] border border-[#03A64A] p-2 rounded"
                    onClick={() => handleEditClick(product)}
                  >
                    <TiEdit size={15} />
                  </div>
                  <div
                    className="cursor-pointer text-[#F28322] border border-[#F28322] p-2 rounded"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <MdOutlineDeleteOutline size={15} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal modal-open bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center ">
          <div className="modal-box w-full max-w-2xl p-6 rounded  bg-[#181D26] text-gray-200">
            <h3 className="text-lg font-bold mb-4">
              {currentProduct?.id === 0 ? "Add Product" : "Edit Product"}
            </h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={currentProduct?.sku || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct?.name || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Description</label>
                <input
                  type="text"
                  name="description"
                  value={currentProduct?.description || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentProduct?.quantity || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={currentProduct?.low_stock_threshold || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Price</label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct?.price || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Category</label>
                <select
                  name="category_id"
                  value={currentProduct?.category_id || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800"
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
        <div className="fixed inset-0 flex items-center justify-center z-50 text-gray-200  bg-opacity-50">
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-gray-800 rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Delete Product</h2>
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
    </div>
  );
};

export default ProductsPage;