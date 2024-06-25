import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";

interface Debtors {
  name: string;
  description: "";

  initialAmountOwed: number;

  owes: number;

  owingState: boolean;

  paid: number;
}

interface Debts {
  totalOwed: number;

  totalPaid: number;

  total: number;
  count: number;
}

const DebtorsPage: React.FC = () => {
  const [Debtors, setDebtors] = useState<Debtors[]>([]);
  const [Debts, setDebts] = useState<Debts>(); // Store fetched Debtors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Debtors>({
    name: "",

    initialAmountOwed: 0,
    description: "",

    owes: 0,

    owingState: true,

    paid: 0,
  });

  useEffect(() => {
    handleGetDebtors();
    handleGetDebtsCalc();
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
      await axios.post("http://localhost:3000/debtors", formData);
      setIsModalOpen(false);
      console.log("Form submitted successfully");

      setFormData({
        name: "",
        description: "",

        initialAmountOwed: 0,

        owes: 0,

        owingState: true,

        paid: 0,
      });

      // Fetch Debtors after successful submission
      handleGetDebtors();
      handleGetDebtsCalc();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDebtors = async () => {
    setLoading(true);
    setError("");

    try {
      // Make the GET request
      const response = await axios.get<Debtors[]>(
        "http://localhost:3000/debtors"
      );
      setDebtors(response.data); // Store fetched data
      console.log("Fetched data successfully:", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDebtsCalc = async () => {
    setLoading(true);
    setError("");

    try {
      // Make the GET request
      const response = await axios.get<Debts>(
        "http://localhost:3000/debtors/debts"
      );
      setDebts(response.data); // Store fetched data
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
        <div className="p-4 text-3xl text-black bg-[#F4F3F3]">Debtors</div>
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
            + Add Debtor
            {error && <div className="text-red-500">{error}</div>}
            {isModalOpen && (
              <dialog open className="modal">
                <form onSubmit={handleSubmit} className="modal-box">
                  <div className="p-2 text-lg">Add Debtor</div>

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
                      name="initialAmountOwed"
                      value={formData.initialAmountOwed}
                      onChange={handleChange}
                      className="grow"
                      placeholder="Owing Amount"
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
      <div className="bg-[#F4F3F3] p-4 grid grid-cols-2 grid-rows-2 md:grid-cols-5 md:grid-rows-1">
        <Card items="Total Owed" number={Debts?.totalOwed} />
        <Card items="Total Paid" number={Debts?.totalPaid} />
        <Card items="Total" number={Debts?.total} />
        <Card items="Debtors" number={Debts?.count} />
      </div>
      <div className="overflow-x-auto text-black">
        <table className="table ">
          <thead>
            <tr className="border-none">
              <th>Name</th>
              <th>Description</th>

              <th>Owes</th>
              <th>Initial Owed</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically render rows */}
            {Debtors.map((product, index) => (
              <tr className="border-none" key={index}>
                <td>{product.name}</td>
                <td>{product.description}</td>

                <td>{product.owes}</td>

                <td>{product.initialAmountOwed}</td>
                <td>{product.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebtorsPage;
