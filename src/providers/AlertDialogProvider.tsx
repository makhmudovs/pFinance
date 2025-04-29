import { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertDialogOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}

interface AlertDialogContextType {
  showDialog: (options: AlertDialogOptions) => void;
  isOpen: boolean;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogOptions, setDialogOptions] = useState<AlertDialogOptions | null>(null);

  const showDialog = (options: AlertDialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (dialogOptions?.onConfirm) {
      await dialogOptions.onConfirm();
    }
    setIsOpen(false);
    setDialogOptions(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setDialogOptions(null);
  };

  return (
    <AlertDialogContext.Provider value={{ showDialog, isOpen }}>
      {children}
      {dialogOptions && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dialogOptions.title || "Are you absolutely sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dialogOptions.description || "This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {dialogOptions.cancelLabel || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {dialogOptions.confirmLabel || "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within an AlertDialogProvider");
  }
  return context;
};