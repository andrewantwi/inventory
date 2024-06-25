import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { menuItems } from "../assets/data";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Home");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content h-[1000px] overflow-auto">
          <Outlet />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full text-white font-semibold bg-[#7E2CE1] rounded-r-xl">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`my-2 ${
                  activeItem === item.name
                    ? "bg-[#924FF3] rounded-md"
                    : "hover:bg-[#924FF3] rounded-md"
                }`}
                onClick={() => handleItemClick(item.name)}
              >
                <NavLink
                  to={item.link}
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Layout;
