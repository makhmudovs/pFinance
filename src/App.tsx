import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { AlertDialogProvider } from "@/providers/AlertDialogProvider";
import { Login } from "@/pages/auth/Login";
import { Register } from "./pages/auth/register";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Pots from "./pages/Pots";
import Bills from "./pages/Bills";
import { NotFound } from "./pages/404/not-found";

const App = () => {
  return (
    <>
      <AlertDialogProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" index element={<Overview />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/pots" element={<Pots />} />
            <Route path="/bills" element={<Bills />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AlertDialogProvider>
    </>
  );
};

export default App;
