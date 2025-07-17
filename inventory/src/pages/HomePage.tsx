import Card from "../components/Card";
import { cardData, storeData, storeData2 } from "../assets/data";
import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "../components/Chart";
import { NavLink } from "react-router-dom";

interface Product {
  productName: string;
  totalQuantitySold: number;
  numberLeftSum: number;
  soldOutCount: number;
  numberSold: number;
  inStockCount: number;
}

function HomePage() {
  const [products, setProducts] = useState<Product>();

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
      const response = await axios.get<Product>(
        "http://localhost:8000/api/v1/analytics/low-stock"
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="min-h-screen overflow-auto">
       <div className="flex bg-[#181D26] items-center justify-between px-8 m-4 border-none rounded-lg">
        <div className="p-4 text-3xl text-white">HomePage</div>
      </div>
      <div className="bg-[#0A0D15] p-2 rounded-lg m-4">
     <div className="flex flex-col md:flex-row flex-wrap gap-4">

        <div className="flex-1 min-w-[300px] bg-[#13161E] rounded-2xl shadow p-6">
          <div className="flex justify-between">
            <div>Product Name</div>
            <div className="bg-[#181D26] p-2 rounded-lg">Price</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Card 1</h2>
          <p>This is the content of card 1.</p>
        </div>

        <div className="flex-1 min-w-[300px] bg-[#13161E] rounded-2xl shadow p-6">
          <div className="flex justify-between">
            <div>Product Name</div>
            <div className="bg-[#181D26] p-2 rounded-lg">Price</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Card 2</h2>
          <p>This is the content of card 2.</p>
        </div>

        <div className="flex-1 min-w-[300px] bg-[#13161E] rounded-2xl shadow p-6">
          <div className="flex justify-between">
            <div>Product Name</div>
            <div className="bg-[#181D26] p-2 rounded-lg">Price</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Card 3</h2>
          <p>This is the content of card 3.</p>
        </div>
        
      </div>
      <div className="flex flex-col md:flex-row gap-4 my-4">

        {/* Card 2 - 2/3 width on md+ screens */}
        <div className="w-full md:w-2/3 bg-[#13161E] rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Card 2</h2>
          <p>This card takes two thirds of the screen on medium and larger screens.</p>
        </div>
        {/* Card 1 - 1/3 width on md+ screens */}
        <div className="w-full md:w-1/3 bg-[#13161E] rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Card 1</h2>
          <p>This card takes one third of the screen on medium and larger screens.</p>
        </div>

      </div>
      <label htmlFor="my-drawer-2" className="btn btn-[#04D9B2] drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    </div>
  );
}

export default HomePage;