import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import Layout from "./components/Sidebar";
import DebtorsPage from "./pages/DebtorsPage";
import FinancesPage from "./pages/FinancesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="/products/:categoryId" element={<ProductsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="debtors" element={<DebtorsPage />} />
          <Route path="finances" element={<FinancesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
