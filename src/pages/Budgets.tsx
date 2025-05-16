import { fetchBudgets } from "@/services/budgets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/currency";
import { COLORS } from "@/constants";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { BudgetsForm } from "@/components/budgets/budgets-form";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAlert } from "@/providers/AlertProvider";

export function Budgets() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
    retry: (failureCount, err) => {
      if (err.message.includes("Missing or insufficient permissions")) {
        return false; // Don't retry on permission errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  const queryClient = useQueryClient();

  const { showDialog } = useAlertDialog();
  const { showAlert } = useAlert();

  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "budgets", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showAlert({
        title: "Heads up!",
        description: "Budget deleted",
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        showAlert({
          title: "Error",
          description: error.message,
        });
      } else {
        showAlert({
          title: "Error",
          description: "Unknown error occured, plz reload",
        });
      }
    },
  });

  if (isLoading) return <Loader />;
  if (error) {
    const errorMessage = error.message.includes(
      "Missing or insufficient permissions"
    )
      ? "You do not have permission to access this data. Please log in or contact support."
      : "Failed to fetch data. Please try again later.";
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <BudgetsForm />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.length > 0
          ? data.map((budget) => (
              <Card key={budget.id}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full inline-block ${
                        COLORS[budget.theme]
                      }`}
                    ></span>{" "}
                    <span className="capitalize">{budget.category}</span>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer">
                        <Ellipsis className="text-green-500 w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Operations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          showDialog({
                            title: "Confirm Deletion",
                            description:
                              "Are you sure you want to delete budget?",
                            confirmLabel: "Delete",
                            onConfirm: async () => {
                              //delete transaction
                              deleteBudgetMutation.mutate(budget.id);
                            },
                          });
                        }}
                      >
                        Delete budget
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <Progress className="h-3" value={33} />
                  <div className="flex justify-between mt-4 border rounded-lg p-2">
                    <div>
                      <h5 className="text-sm font-light">Spent</h5>
                      <h4 className="text-lg font-semibold">
                        {formatMoney(budget.spent)}
                      </h4>
                    </div>
                    <div>
                      <h5 className="text-sm font-light">Available</h5>
                      <h4 className="text-lg font-semibold">
                        {formatMoney(budget.limit)}
                      </h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : "No budget available plz add"}
      </div>
    </>
  );
}
