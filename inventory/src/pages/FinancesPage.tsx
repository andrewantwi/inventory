import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "../components/Chart";

interface Debts {
  totalOwed: number;
  totalPaid: number;
  total: number;
}

interface CalcProduct {
  profit: number;
  netSales: number;
  margin: number;
}

interface Product {
  productCount: number;

  totalNumberPerProduct: number;

  numberLeftSum: number;
  soldOutCount: number;

  inStockCount: number;
}

// const defaultDebts: Debts = {
//   totalOwed: 0,
//   totalPaid: 0,
//   total: 0,
//   count: 0,
// };

// const defaultProducts: CalcProduct = {
//   profit: 0,
//   netSales: 0,
//   margin: 0,
// };

function FinancesPage() {
  const [finances, setFinances] = useState<Debts | null>(null);
  const [products, setProducts] = useState<CalcProduct | null>(null);
  const [productCounts, setProductsCounts] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetFinances = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Debts>(
        "http://localhost:3000/debtors/debts"
      );
      setFinances(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<CalcProduct>(
        "http://localhost:3000/products/calc"
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetProductsCount = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Product>(
        "http://localhost:3000/products/counts"
      );
      setProductsCounts(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFinances();
    handleGetProducts();
    handleGetProductsCount();
  }, []);

  const transformDebtsData = (data: Debts) => [
    { name: "Total Owed", value: data.totalOwed },
    { name: "Total Paid", value: data.totalPaid },
    { name: "Total", value: data.total },
  ];

  const transformProductsData = (data: CalcProduct) => [
    { name: "Profit", value: data.profit },
    { name: "Net Sales", value: data.netSales },
    { name: "Margin", value: data.margin },
  ];
  const transformProductData = (data: Product) => [
    { name: "Product Count", value: data.productCount },
    { name: "Total Number Per Product", value: data.totalNumberPerProduct },
    { name: "Number Left Sum", value: data.numberLeftSum },
    { name: "Sold Out Count", value: data.soldOutCount },
    { name: "In Stock Count", value: data.inStockCount },
  ];

  return (
    <div className="">
      <div className="flex bg-[#F4F3F3] items-center justify-between p-4">
        <div className="p-4 text-3xl text-black bg-[#F4F3F3]">Finances</div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 p-2 gap-4">
        <div>
          <div className="text-black">Finances</div>
          <div className="w-full h-[200px] border p-2 shadow-md rounded-lg">
            {finances && (
              <Chart
                data={transformDebtsData(finances)}
                xKey="name"
                yKey="value"
              />
            )}
          </div>
        </div>
        <div>
          <div className="text-black">Products</div>
          <div className="w-full h-[200px] border p-2 shadow-md rounded-lg">
            {products && (
              <Chart
                data={transformProductsData(products)}
                xKey="name"
                yKey="value"
              />
            )}
          </div>
        </div>
        <div>
          <div className="text-black">Products</div>
          <div className="w-full h-[200px] border p-2 shadow-md rounded-lg">
            {productCounts && (
              <Chart
                data={transformProductData(productCounts)}
                xKey="name"
                yKey="value"
              />
            )}
          </div>
        </div>

        {/* Add more charts as needed */}
      </div>
    </div>
  );
}

export default FinancesPage;
