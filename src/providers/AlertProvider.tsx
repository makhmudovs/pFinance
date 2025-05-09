import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { motion } from "framer-motion";

import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AlertOptions {
  title?: string;
  description?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  isOpen: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({
  children,
  autoCloseDelay = 5000,
}: {
  children: ReactNode;
  autoCloseDelay?: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAlertOptions(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDelay]);

  return (
    <AlertContext.Provider value={{ showAlert, isOpen }}>
      {children}
      {alertOptions && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 w-4/5 lg:w-1/4"
        >
          <Alert className="flex items-center justify-between">
            <div>
              <AlertTitle>{alertOptions.title || "Heads up!"}</AlertTitle>
              <AlertDescription>
                {alertOptions.description || "This is a default message."}
              </AlertDescription>
            </div>
            <div className="mt-2">
              <Button onClick={handleClose} size="icon" variant="outline">
                <X />
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
