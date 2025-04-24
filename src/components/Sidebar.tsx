import { useState } from "react";
import { NavLink } from "react-router-dom";
import Tooltip from "./Tooltip";

import {
  FaHome,
  FaChartPie,
  FaPiggyBank,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { GiPayMoney } from "react-icons/gi";

const Sidebar = () => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navItems = [
    {
      to: "/",
      label: "Overview",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      to: "/transactions",
      label: "Transactions",
      icon: <GrTransaction className="w-5 h-5" />,
    },
    {
      to: "/budgets",
      label: "Budgets",
      icon: <FaChartPie className="w-5 h-5 " />,
    },
    {
      to: "/pots",
      label: "Pots",
      icon: <FaPiggyBank className="w-5 h-5 " />,
    },
    {
      to: "/bills",
      label: "Recurring Bills",
      icon: <GiPayMoney className="w-5 h-5 " />,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 border-r overflow-hidden ${
        collapse ? "w-16" : "w-64 md:translate-x-0"
      } ${collapse ? "" : "-translate-x-full"} bg-[#201F24] `}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col justify-between">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li
              key={item.to}
              className="relative"
              onMouseEnter={() => setHoveredLink(item.to)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 text-gray-800 rounded-lg bg-gray-300  hover:bg-gray-100 "
                    : "flex items-center p-2 text-gray-300 rounded-lg  hover:bg-gray-600"
                }
                aria-label={collapse ? item.label : undefined}
              >
                {item.icon}
                {!collapse && (
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
              {collapse && (
                <Tooltip
                  text={item.label}
                  isVisible={hoveredLink === item.to}
                />
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setCollapse(!collapse)}
          className="px-3 py-2 text-sm font-medium text-white"
        >
          {collapse ? (
            <FaChevronCircleRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center">
              <FaChevronCircleLeft className="h-5 w-5" />
              <span className="ms-2">Minimize Menu</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
