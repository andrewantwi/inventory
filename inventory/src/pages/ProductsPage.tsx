import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  totalNumber: number;
  category: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Store fetched products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    totalNumber: 0,
    category: "",
  });

  useEffect(() => {
    handleGetProducts();
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
      // Make the POST request
      await axios.post("http://localhost:3000/products", formData);
      setIsModalOpen(false);
      console.log("Form submitted successfully");

      // Clear form
      setFormData({
        id: 0,
        name: "",
        description: "",
        costPrice: 0,
        sellingPrice: 0,
        totalNumber: 0,
        category: "",
      });

      // Fetch products after successful submission
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
      // Make the GET request
      const response = await axios.get<Product[]>(
        "http://localhost:3000/products"
      );
      setProducts(response.data); // Store fetched data
      console.log("Fetched data successfully:", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            onClick={() => setIsModalOpen(true)}
          >
            + Add Product
            {error && <div className="text-red-500">{error}</div>}
            {isModalOpen && (
              <dialog open className="modal">
                <form onSubmit={handleSubmit} className="modal-box">
                  <div className="p-2 text-lg">Add Product</div>

                  {error && <div className="text-red-500">{error}</div>}

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Name"
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Description"
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Cost Price"
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Selling Price"
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="number"
                      name="totalNumber"
                      value={formData.totalNumber}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Total Number"
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Category"
                      required
                    />
                  </label>

                  <div className="modal-action">
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <form
                  method="dialog"
                  className="modal-backdrop"
                  onClick={() => setIsModalOpen(false)}
                >
                  <button type="button">Close</button>
                </form>
              </dialog>
            )}
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
              <th>Selling Price</th>
              <th>Total Number</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically render rows */}
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.costPrice}</td>
                <td>{product.sellingPrice}</td>
                <td>{product.totalNumber}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
