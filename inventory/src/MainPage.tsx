import NavBar from "./components/NavBar";
import Layout from "./components/Sidebar";

function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Layout />
    </div>
  );
}

export default MainPage;
