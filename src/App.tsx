import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { AlertDialogProvider } from "@/providers/AlertDialogProvider";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Pots from "./pages/Pots";
import Bills from "./pages/Bills";


const App = () => {
  return (
    <>
      <AlertDialogProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" index element={<Overview />} />
            <Route path="/transactions" index element={<Transactions />} />
            <Route path="/budgets" index element={<Budgets />} />
            <Route path="/pots" index element={<Pots />} />
            <Route path="/bills" index element={<Bills />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AlertDialogProvider>
    </>
  );
};

export default App;
