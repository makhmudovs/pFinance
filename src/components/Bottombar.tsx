import { FaChartPie, FaHome, FaPiggyBank } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { NavLink } from "react-router-dom";

const Bottombar = () => {
  const navItems = [
    {
      to: "/",
      label: "Overview",
      icon: <FaHome className="w-7 h-7" />,
    },
    {
      to: "/transactions",
      label: "Transactions",
      icon: <GrTransaction className="w-7 h-7" />,
    },
    {
      to: "/budgets",
      label: "Budgets",
      icon: <FaChartPie className="w-7 h-7" />,
    },
    {
      to: "/pots",
      label: "Pots",
      icon: <FaPiggyBank className="w-7 h-7" />,
    },
    {
      to: "/bills",
      label: "Recurring Bills",
      icon: <GiPayMoney className="w-7 h-7" />,
    },
  ];
  return (
    <div className="block lg:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-[#201F24] border-t border-gray-200 ">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "inline-flex flex-col items-center justify-center px-5 bg-amber-50"
                : "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 text-gray-400"
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Bottombar;
