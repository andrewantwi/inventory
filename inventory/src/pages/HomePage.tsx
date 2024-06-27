import Card from "../components/Card";
import { cardData, storeData, storeData2 } from "../assets/data";
import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "../components/Chart";
import { NavLink } from "react-router-dom";

interface Product {
  productCount: number;

  totalNumberPerProduct: number;

  numberLeftSum: number;
  soldOutCount: number;
  numberSold: number;
  inStockCount: number;
}

function HomePage() {
  const [products, setProducts] = useState<Product>(); // Store fetched products

  useEffect(() => {
    handleGetProducts();
  }, []);

  const transformProductData = (data: Product) => [
    { name: "Product Count", value: data.productCount },
    { name: "Total Number Per Product", value: data.totalNumberPerProduct },
    { name: "Number Left Sum", value: data.numberLeftSum },
    { name: "Sold Out Count", value: data.soldOutCount },
    { name: "In Stock Count", value: data.inStockCount },
    { name: "Number of sold", value: data.numberSold },
  ];

  const handleGetProducts = async () => {
    try {
      // Make the GET request
      const response = await axios.get<Product>(
        "http://localhost:3000/products/counts"
      );
      setProducts(response.data); // Store fetched data
      console.log("Fetched data successfully:", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      console.error("Error fetching data:");
    }
  };

  return (
    <div className="min-h-screen overflow-auto">
      <div className="p-4 text-3xl text-black bg-[#F4F3F3] ">
        Recent Activity
      </div>
      <div className="bg-[#F4F3F3] p-4 grid grid-cols-2 grid-rows-2 md:grid-cols-5 md:grid-rows-1">
        <Card items="Products" number={products?.productCount} />
        <Card items="Available" number={products?.inStockCount} />
        <Card items="Number Sold" number={products?.numberSold} />
        <Card
          items="Total number Left"
          number={products?.totalNumberPerProduct}
        />
        <Card items="Total number" number={products?.numberLeftSum} />
      </div>
      <div className="container mx-auto p-4">
        <div className="flex w-full">
          <NavLink
            to="finances"
            className="card mx-2 shadow-md p-4 bg-[#F4F3F3] w-[50%]"
          >
            <div className="card-title text-black">Sales</div>
            <div className="card-body">
              {products && (
                <Chart
                  data={transformProductData(products)}
                  xKey="name"
                  yKey="value"
                />
              )}
            </div>
          </NavLink>
          <NavLink
            to="categories"
            className="card mx-2 p-4 shadow-md bg-[#F4F3F3] w-[30%]"
          >
            <div className="card-title text-black">Top Item Categories</div>
            <div className="card-body p-5 grid sm:grid-cols-2 sm:grid-rows-2 lg:grid-cols-3 lg:grid-rows-2 gap-2">
              {cardData.map(({ id, bgColor, textColor, icon: Icon }) => (
                <div
                  key={id}
                  className="card"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  <div className="card-body p-4 flex justify-center items-center">
                    <Icon className="text-3xl" />
                  </div>
                </div>
              ))}
            </div>
          </NavLink>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex container">
          <div className="card mx-2 shadow-md p-4 bg-[#F4F3F3] w-[30%]">
            <div className="card-title text-black">Stock Numbers</div>
            <div className="card-body p-2">
              <div className="overflow-x-auto text-black">
                <table className="w-full border-collapse">
                  <tbody>
                    {storeData2.map((row, index) => (
                      <tr key={index}>
                        <td className="text-[12px] p-2">{row.location}</td>
                        <td className="text-[12px] p-2">{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card mx-2 p-4 shadow-md bg-[#F4F3F3] w-[50%]">
            <div className="card-title text-black">Stores list</div>
            <div className="card-body p-2">
              <div className="overflow-x-auto text-black">
                <table className="w-full border-collapse">
                  <tbody>
                    {storeData.map((row, index) => (
                      <tr key={index}>
                        <td className="text-[12px] p-2">{row.location}</td>
                        <td className="text-[12px] p-2">
                          {row.employees} employees
                        </td>
                        <td className="text-[12px] p-2">{row.items} items</td>
                        <td className="text-[12px] p-2">{row.orders} Orders</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <label
        htmlFor="my-drawer-2"
        className="btn btn-primary drawer-button lg:hidden"
      >
        Open drawer
      </label>
    </div>
  );
}

export default HomePage;
