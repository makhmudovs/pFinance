"use client";

import type * as React from "react";
import { BookOpen, Bot, Settings2, Home } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import Logo from "@/assets/Logo.svg";
import LogoSm from "@/assets/logo-small.svg";
import LogoDark from "@/assets/LogoDark.svg";
import LogoSmDark from "@/assets/logo-small-dark.svg";
import { useTheme } from "./theme-provider";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: Home,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: Bot,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: BookOpen,
    },
    {
      title: "Pots",
      url: "/pots",
      icon: Settings2,
    },
    // {
    //   title: "Recurring bills",
    //   url: "/bills",
    //   icon: Settings2,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, open } = useSidebar();
  const { theme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                {theme === "light" ? (
                  <img
                    src={!open || isMobile ? LogoSmDark : LogoDark}
                    alt="logo"
                  />
                ) : (
                  <img src={!open || isMobile ? LogoSm : Logo} alt="logo" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
