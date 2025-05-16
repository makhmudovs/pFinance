import { Route, Routes, useLocation } from "react-router-dom";

import { Layout } from "./Layout";
import { AlertDialogProvider } from "@/providers/AlertDialogProvider";
import { Login } from "@/pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Overview } from "./pages/Overview";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { Pots } from "./pages/Pots";
// import { Bills } from "./pages/Bills";
import { NotFound } from "./pages/404/not-found";
import { TransactionModal } from "./components/transactions/transaction-modal";
import { PotDetails } from "./components/pots/pot-details";
import { PotDeposit } from "./components/pots/pot-deposit";
import { PotWithdraw } from "./components/pots/pot-withdraw";

const App = () => {
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  return (
    <>
      <AlertDialogProvider>
        <Routes location={previousLocation || location}>
          <Route element={<Layout />}>
            <Route path="/" index element={<Overview />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/pots" element={<Pots />} />
            {/* <Route path="/bills" element={<Bills />} /> */}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Show the modal when a background location is set */}
        {previousLocation && (
          <Routes>
            <Route path="/transactions/:id" element={<TransactionModal />} />
            <Route path="/pots/:id" element={<PotDetails />} />
            <Route path="/pots/deposit/:id" element={<PotDeposit />} />
            <Route path="/pots/withdraw/:id" element={<PotWithdraw />} />
          </Routes>
        )}
      </AlertDialogProvider>
    </>
  );
};

export default App;
