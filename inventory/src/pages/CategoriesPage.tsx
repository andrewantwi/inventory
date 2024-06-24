import React, { useState, useEffect } from "react";
import axios from "axios";
import { GiTrousers } from "react-icons/gi";

interface category {
  name: string;

  total: number;
}

const CategoriesPage = () => {
  const [categories, setcategories] = useState<category[]>([]); // Store fetched categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<category>({
    name: "",

    total: 0,
  });

  useEffect(() => {
    handleGetcategories();
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
      await axios.post("http://localhost:3000/categories", formData);
      setIsModalOpen(false);
      console.log("Form submitted successfully");

      // Clear form
      setFormData({
        name: "",
        total: 0,
      });

      // Fetch categories after successful submission
      handleGetcategories();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetcategories = async () => {
    setLoading(true);
    setError("");

    try {
      // Make the GET request
      const response = await axios.get<category[]>(
        "http://localhost:3000/categories"
      );
      setcategories(response.data); // Store fetched data
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
        <div className="p-4 text-3xl text-black bg-[#F4F3F3]">categories</div>
        <div className="flex items-center">
          <div
            className="bg-[#4B03A4] text-white rounded-3xl px-4 py-2 mx-2 text-sm cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            + Add category
            {error && <div className="text-red-500">{error}</div>}
            {isModalOpen && (
              <dialog open className="modal">
                <form onSubmit={handleSubmit} className="modal-box">
                  <div className="p-2 text-lg">Add category</div>

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
                      type="number"
                      name="total"
                      value={formData.total}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Total Number"
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
      <div className="grid md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4 p-10">
        {" "}
        {categories.map((category) => (
          <div className="w-76 shadow-xl bg-[#F2F2F2] p-2 rounded-lg">
            <div className="">
              <div className="flex justify-center items-center text-4xl text-[#4805A6] bg-[#DED0F2] p-16 rounded-lg">
                <GiTrousers />
              </div>
              <div className="p-4">
                <div className="font-bold text-black">{category.name}</div>
                <div className="text-sm">{category.total} items</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
