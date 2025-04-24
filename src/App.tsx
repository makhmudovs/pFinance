import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Pots from "./pages/Pots";
import Bills from "./pages/Bills";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" index element={<Overview />} />
          <Route path="/transactions" index element={<Transactions />} />
          <Route path="/budgets" index element={<Budgets />} />
          <Route path="/pots" index element={<Pots />} />
          <Route path="/bills" index element={<Bills />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
