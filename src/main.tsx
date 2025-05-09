import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AlertProvider } from "@/providers/AlertProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AlertProvider autoCloseDelay={3000}>
            <App />
          </AlertProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
