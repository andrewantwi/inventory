import { IoHomeOutline } from "react-icons/io5";
import {
  MdOutlineShoppingBag,
  MdRollerSkating,
  MdBackpack,
} from "react-icons/md";
import { LuShapes } from "react-icons/lu";
import { CiMoneyBill } from "react-icons/ci";
import { AiOutlineTool } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import {
  FaTshirt,
  FaHatCowboy,
  FaShoppingBag,
  FaGlasses,
} from "react-icons/fa";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  link: string;
}

interface CardData {
  id: string;
  bgColor: string;
  textColor: string;
  icon: React.ElementType;
}

interface StoreData {
  location: string;
  employees: number;
  items: number;
  orders: number;
}

interface StoreData2 {
  location: string;
  orders: number;
}

export const menuItems: MenuItem[] = [
  { name: "Home", icon: <IoHomeOutline />, link: "/" },
  { name: "Products", icon: <MdOutlineShoppingBag />, link: "/products" },
  { name: "Categories", icon: <LuShapes />, link: "/categories" },
  { name: "Finances", icon: <CiMoneyBill />, link: "/finances" },
  { name: "Debtors", icon: <GiTakeMyMoney />, link: "/debtors" },
  { name: "Settings", icon: <AiOutlineTool />, link: "/settings" },
];

export const cardData: CardData[] = [
  { id: "shirt", bgColor: "#04D9B2", textColor: "#11403B", icon: FaTshirt },
  { id: "hat", bgColor: "#04D9B2", textColor: "#11403B", icon: FaHatCowboy },
  { id: "bag", bgColor: "#04D9B2", textColor: "#11403B", icon: FaShoppingBag },
  {
    id: "skating",
    bgColor: "#04D9B2",
    textColor: "#11403B",
    icon: MdRollerSkating,
  },
  {
    id: "backpack",
    bgColor: "#04D9B2",
    textColor: "#11403B",
    icon: MdBackpack,
  },
  { id: "glasses", bgColor: "#04D9B2", textColor: "#11403B", icon: FaGlasses },
];

export const storeData: StoreData[] = [
  { location: "Manchester United, UK", employees: 23, items: 308, orders: 2 },
  { location: "Yorkshire, UK", employees: 11, items: 291, orders: 15 },
  { location: "Hull city, UK", employees: 5, items: 41, orders: 11 },
  { location: "Leicester city, UK", employees: 16, items: 261, orders: 8 },
];

export const storeData2: StoreData2[] = [
  { location: "Manchester United, UK", orders: 2 },
  { location: "Yorkshire, UK", orders: 15 },
  { location: "Hull city, UK", orders: 11 },
  { location: "Leicester city, UK", orders: 8 },
];
