import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import { TiEdit } from "react-icons/ti";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Debtor {
  _id?: string;
  name: string;
  description: string;
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
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [debts, setDebts] = useState<Debts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDebtor, setCurrentDebtor] = useState<Debtor | null>(null);
  const [debtorToDelete, setDebtorToDelete] = useState<Debtor | null>(null);

  const [formData, setFormData] = useState<Debtor>({
    _id: "",
    name: "",
    description: "",
    initialAmountOwed: 0,
    owes: 0,
    owingState: true,
    paid: 0,
  });

  useEffect(() => {
    handleGetDebtors();
    handleGetDebtsCalc();
  }, []);

  const handleEditClick = (debtor: Debtor) => {
    setCurrentDebtor(debtor);
    setFormData(debtor);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (debtor: Debtor) => {
    setDebtorToDelete(debtor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!debtorToDelete) return;
    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:3000/debtors/${debtorToDelete._id}`);
      setIsDeleteModalOpen(false);
      setDebtorToDelete(null);
      handleGetDebtors();
    } catch (err) {
      console.error("Error deleting debtor:", err);
      setError("Failed to delete the debtor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "owes" || name === "paid" || name === "initialAmountOwed"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (currentDebtor) {
        await axios.put(`http://localhost:3000/debtors/`, formData);
      } else {
        await axios.post("http://localhost:3000/debtors", formData);
      }
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
      const response = await axios.get<Debtor[]>(
        "http://localhost:3000/debtors"
      );
      setDebtors(response.data);
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
      const response = await axios.get<Debts>(
        "http://localhost:3000/debtors/debts"
      );
      setDebts(response.data);
      console.log("Fetched debts successfully:", response.data);
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError("Failed to fetch debts. Please try again.");
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
          <div className="bg-[#11403B] text-[#04D9B2] rounded-xl px-8 py-2 mx-2 text-sm">
            Filter By
          </div>
          <div
            className="bg-[#04D9B2] text-white rounded-3xl px-4 py-2 mx-2 text-sm cursor-pointer"
            onClick={() => {
              setFormData({
                name: "",
                description: "",
                initialAmountOwed: 0,
                owes: 0,
                owingState: true,
                paid: 0,
              });
              setCurrentDebtor(null);
              setIsModalOpen(true);
            }}
          >
            + Add Debtor
          </div>
        </div>
      </div>
      <div className="bg-[#F4F3F3] p-4 grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-4">
        <Card items="Total Owed" number={debts?.totalOwed} />
        <Card items="Total Paid" number={debts?.totalPaid} />
        <Card items="Total" number={debts?.total} />
        <Card items="Debtors" number={debts?.count} />
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
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((debtor) => (
              <tr className="border-none" key={debtor._id}>
                <td>{debtor.name}</td>
                <td>{debtor.description}</td>
                <td>{debtor.owes}</td>
                <td>{debtor.initialAmountOwed}</td>
                <td>{debtor.paid}</td>
                <td>
                  <TiEdit
                    className="cursor-pointer text-xl"
                    onClick={() => handleEditClick(debtor)}
                  />
                </td>
                <td>
                  <MdOutlineDeleteOutline
                    className="cursor-pointer text-xl"
                    onClick={() => handleDeleteClick(debtor)}
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
            <h2 className="text-2xl mb-4">
              {currentDebtor ? "Edit Debtor" : "Add Debtor"}
            </h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="text-red-500">{error}</div>}
              <label className="input bg-white input-bordered flex items-center gap-2 mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="grow bg-white"
                  placeholder="Name"
                  required
                />
              </label>
              <label className="input bg-white input-bordered flex items-center gap-2 mb-4">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="grow bg-white"
                  placeholder="Description"
                  required
                />
              </label>
              <label className="input bg-white input-bordered flex items-center gap-2 mb-4">
                <input
                  type="number"
                  name="initialAmountOwed"
                  value={formData.initialAmountOwed}
                  onChange={handleChange}
                  className="grow bg-white"
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
            <h2 className="text-2xl mb-4">Delete Debtor</h2>
            <p>Are you sure you want to delete this debtor?</p>
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

export default DebtorsPage;
