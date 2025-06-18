// CategoriesPage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GiTrousers } from "react-icons/gi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

 
interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const CategoriesPage: React.FC = () => {

   const baseUrl = import.meta.env.VITE_API_BASE_URL;


  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${baseUrl}/categories`, formData);
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      handleGetCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add the category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Category[]>(`${baseUrl}/categories/`);
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    setError("");

    try {
      await axios.delete(`${baseUrl}/categories/${categoryToDelete.id}`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      handleGetCategories();
    } catch (err) {
      setError("Failed to delete the category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (categoryId: number) => {
    navigate(`/products/${categoryId}`);
  };

  return (
    <div>
      <div className="flex bg-[#F4F3F3] items-center justify-between p-4">
        <div className="p-4 text-3xl text-black bg-[#F4F3F3]">Categories</div>
        <div className="flex items-center">
          <div
            className="bg-[#04D9B2] text-white rounded-3xl px-4 py-2 mx-2 text-sm cursor-pointer"
            onClick={() => {
              setFormData({ name: "", description: "" });
              setIsModalOpen(true);
            }}
          >
            + Add Category
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4 p-10">
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
            <div
              className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="bg-white rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl mb-4">Add Category</h2>
                {error && <div className="text-red-500">{error}</div>}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Description"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {categories.map((category) => (
          <Link to={`/products/${category.id}`}

            key={category.id}
            className="w-76 shadow-xl bg-[#eff0f0] p-2 rounded-lg relative cursor-pointer"
            onClick={() => handleCardClick(category.id)}
          >
            <div className="flex justify-center items-center text-4xl text-[#11403B] bg-[#dee4e4] p-16 rounded-lg">
              <GiTrousers />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-black">{category.name}</div>
                <div className="text-sm">{category.description || "No description"}</div>
              </div>
              <MdOutlineDeleteOutline
                className="cursor-pointer text-xl text-[#11403B]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(category);
                }}
              />
            </div>
          </Link>
        ))}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Delete Category</h2>
            <p>Are you sure you want to delete this category?</p>
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

export default CategoriesPage;
