import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Bottombar from "./components/Bottombar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Bottombar/>
      <div className="p-4 md:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
