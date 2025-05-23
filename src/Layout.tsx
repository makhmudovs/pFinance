import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "./components/header";
import { Loader } from "./components/shared/loader";

export function Layout(){
  const { user, loading } = useAuth();
  if (loading) return <Loader />;

  return user ? (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4">
            {/* aspect-video rounded-xl bg-muted/50 */}
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};
