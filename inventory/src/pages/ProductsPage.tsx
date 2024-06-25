import React, { useState, useEffect } from "react";
import { TiEdit } from "react-icons/ti";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";

interface Product {
  _id: number;
  name: string;
  description: string;
  costPrice: number;
  soldOut: boolean | undefined;
  sellingPrice: number;
  totalNumber: number;
  category: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentProduct) {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentProduct) return;
    setLoading(true);
    setError("");

    try {
      if (currentProduct._id === 0) {
        await axios.post("http://localhost:3000/products", currentProduct);
      } else {
        await axios.put(
          `http://localhost:3000/products/${currentProduct._id}`,
          currentProduct
        );
      }
      setIsModalOpen(false);
      setCurrentProduct(null);
      handleGetProducts();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Product[]>(
        "http://localhost:3000/products"
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
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
      await axios.delete(
        `http://localhost:3000/products/${productToDelete._id}`
      );
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      handleGetProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex bg-[#F4F3F3] items-center justify-between p-4">
        <div className="p-4 text-3xl text-black bg-[#F4F3F3]">Products</div>
        <div className="flex items-center">
          <div className="form-control mx-2">
            <input
              type="text"
              placeholder="Search"
              className="input w-24 md:w-auto bg-white text-[#4B03A4] rounded-lg px-16 py-4 h-7 text-start"
            />
          </div>
          <div className="bg-[#AA77F2] text-[#4B03A4] rounded-xl px-8 py-2 mx-2 text-sm">
            Filter By
          </div>
          <div
            className="bg-[#4B03A4] text-white rounded-3xl px-4 py-2 mx-2 text-sm cursor-pointer"
            onClick={() => {
              setCurrentProduct({
                _id: 0,
                name: "",
                description: "",
                costPrice: 0,
                soldOut: currentProduct?.soldOut,
                sellingPrice: 0,
                totalNumber: 0,
                category: "",
              });
              setIsModalOpen(true);
            }}
          >
            + Add Product
          </div>
        </div>
      </div>
      <div className="overflow-x-auto text-black">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Cost Price</th>
              <th>Status</th>
              <th>Selling Price</th>
              <th>Total Number</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.costPrice}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      product.soldOut
                        ? "bg-[#4B03A4] text-white"
                        : "bg-[#4B03A4] text-white"
                    }`}
                  >
                    {product.soldOut ? "Sold Out" : "Active"}
                  </span>
                </td>
                <td>{product.sellingPrice}</td>
                <td>{product.totalNumber}</td>
                <td>{product.category}</td>
                <td>
                  <TiEdit
                    className="cursor-pointer text-xl"
                    onClick={() => handleEditClick(product)}
                  />
                </td>
                <td>
                  <MdOutlineDeleteOutline
                    className="cursor-pointer text-xl"
                    onClick={() => handleDeleteClick(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl mb-4 ">
                {currentProduct?._id === 0 ? "Add Product" : "Edit Product"}
              </h2>

              {error && <div className="text-red-500">{error}</div>}

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct?.name || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Name"
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={currentProduct?.description || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Description"
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={currentProduct?.costPrice || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Cost Price"
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={currentProduct?.sellingPrice || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Selling Price"
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">
                  Total Number
                </label>
                <input
                  type="number"
                  name="totalNumber"
                  value={currentProduct?.totalNumber || 0}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Total Number"
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={currentProduct?.category || ""}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="Category"
                  required
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-8 z-10 shadow-lg w-full max-w-md mx-auto">
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
  );
};

export default ProductsPage;
