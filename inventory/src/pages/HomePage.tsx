import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  defs,
  linearGradient,
} from "recharts";

interface Product {
  productName: string;
  totalQuantitySold: number;
  numberLeftSum: number;
  soldOutCount: number;
  numberSold: number;
  inStockCount: number;
}

interface ProductAnalytics {
  products: Product[];
  productCount: number;
  totalQuantitySold: number;
  numberLeftSum: number;
  soldOutCount: number;
  numberSold: number;
  inStockCount: number;
}

function HomePage() {
  // Initialize with sample data
  const [products] = useState<ProductAnalytics>({
    products: [
      { productName: "Product A", totalQuantitySold: 500, numberLeftSum: 100, soldOutCount: 10, numberSold: 400, inStockCount: 90 },
      { productName: "Product B", totalQuantitySold: 700, numberLeftSum: 150, soldOutCount: 15, numberSold: 550, inStockCount: 135 },
    ],
    productCount: 2,
    totalQuantitySold: 1200,
    numberLeftSum: 250,
    soldOutCount: 25,
    numberSold: 950,
    inStockCount: 225,
  });

  // No useEffect since we're using static data
  const transformProductData = (data: ProductAnalytics) => [
    { name: "Jan", value: data.totalQuantitySold / 12 },
    { name: "Feb", value: data.totalQuantitySold / 12 + 100 },
    { name: "Mar", value: data.totalQuantitySold / 12 + 200 },
    { name: "Apr", value: data.totalQuantitySold / 12 + 150 },
    { name: "May", value: data.totalQuantitySold / 12 + 300 },
    { name: "Jun", value: data.totalQuantitySold / 12 + 250 },
  ];

  const transformPurchaseReturnData = (data: ProductAnalytics) => [
    { name: "Jan", value: data.numberSold / 12 },
    { name: "Feb", value: data.numberSold / 12 + 50 },
    { name: "Mar", value: data.numberSold / 12 + 100 },
    { name: "Apr", value: data.numberSold / 12 + 75 },
    { name: "May", value: data.numberSold / 12 + 150 },
    { name: "Jun", value: data.numberSold / 12 + 125 },
  ];

  const transformCustomerData = (data: ProductAnalytics) => [
    { name: "Jan", value: data.inStockCount / 12 },
    { name: "Feb", value: data.inStockCount / 12 + 50 },
    { name: "Mar", value: data.inStockCount / 12 + 100 },
    { name: "Apr", value: data.inStockCount / 12 + 75 },
    { name: "May", value: data.inStockCount / 12 + 150 },
    { name: "Jun", value: data.inStockCount / 12 + 125 },
  ];

  const transformDeviceData = (data: ProductAnalytics) => [
    { name: "Desktop", value: data.productCount * 0.6 },
    { name: "Mobile", value: data.productCount * 0.3 },
    { name: "Tablet", value: data.productCount * 0.1 },
  ];

  const COLORS = ["#82ca9d", "#ffc658", "#ff7300"];

  return (
    <div className="min-h-screen bg-[#0A0D15] text-white p-6 font-semibold">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-4">9 Jan 2024</span>
          <input type="text" placeholder="Search" className="p-2 rounded bg-[#181D26]" />
          <div className="ml-4 flex items-center">
            <img src="https://via.placeholder.com/30" alt="User" className="rounded-full mr-2" />
            <span>Jane Cooper</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Amount */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Total Amount</h2>
          <p className="text-2xl font-bold">${products.totalQuantitySold}</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={transformProductData(products)}>
              <defs>
                <linearGradient id="colorTotalAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="url(#colorTotalAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Total Revenue</h2>
          <p className="text-2xl font-bold">${products.numberSold}</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={transformPurchaseReturnData(products)}>
              <defs>
                <linearGradient id="colorTotalRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#ffc658" fill="url(#colorTotalRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Total Customer */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Total Customer</h2>
          <p className="text-2xl font-bold">{products.inStockCount}</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={transformCustomerData(products)}>
              <defs>
                <linearGradient id="colorTotalCustomer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#ff7300" fill="url(#colorTotalCustomer)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6 mt-6">
        {/* Product Sell / Purchase Return */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Product Sell / Purchase Return</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={transformProductData(products)}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="url(#colorSell)" />
              <Area type="monotone" dataKey="value" stroke="#ffc658" fill="url(#colorReturn)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customer */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Top Customer</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="p-4 text-left">Customer ID</th>
                <th className="p-4 text-left">Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {products.products.map((product, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-4">{`#CUST${index + 1}`}</td>
                  <td className="p-4">{product.productName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* User Base by Device Preferences */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">User Base by Device Preferences</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformDeviceData(products)}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="url(#colorBar)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Buyers Profile */}
        <div className="bg-[#13161E] p-8 rounded-lg">
          <h2 className="text-sm">Buyers Profile</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transformDeviceData(products)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {transformDeviceData(products).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2">
            <span>Male: 60.3%</span>
            <span>Female: 40.3%</span>
            <span>Others: 0.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;