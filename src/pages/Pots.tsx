import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader, Minus, Percent, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/currency";
import { COLORS } from "@/constants";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAlert } from "@/providers/AlertProvider";
import { Button } from "@/components/ui/button";
import { fetchPots } from "@/services/pots";
import { useLocation, useNavigate } from "react-router-dom";
import { PotForm } from "@/components/pots/pot-form";

export function Pots() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pots"],
    queryFn: fetchPots,
    retry: (failureCount, err) => {
      if (err.message.includes("Missing or insufficient permissions")) {
        return false; // Don't retry on permission errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();
  const { showDialog } = useAlertDialog();
  const { showAlert } = useAlert();

  const deletePotMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "pots", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      showAlert({
        title: "Heads up!",
        description: "Pot deleted",
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
      <div className="flex justify-end pb-4">
        <PotForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data.length > 0
          ? data.map((pot) => (
              <Card key={pot.id}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full inline-block ${
                        COLORS[pot.theme]
                      }`}
                    ></span>{" "}
                    <span className="capitalize">{pot.name}</span>
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              showDialog({
                                title: "Confirm Deletion",
                                description:
                                  "Are you sure you want to delete pot?",
                                confirmLabel: "Delete",
                                onConfirm: async () => {
                                  //delete pot
                                  deletePotMutation.mutate(pot.id);
                                },
                              });
                            }}
                          >
                            <Trash className="text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Pot</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            onClick={() => {
                              navigate(`/pots/${pot.id}`, {
                                state: { previousLocation: location },
                              });
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <Eye className="text-indigo-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Pot</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-4 p-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm">Total Saved</h5>
                      <h4 className="text-2xl font-semibold">
                        {formatMoney(pot.current_amount)}
                      </h4>
                    </div>

                    <div className="mt-2">
                      <Progress
                        className="h-3"
                        value={(pot.current_amount / pot.goal_amount) * 100}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <h5 className="text-sm font-light flex items-center">
                          {(
                            (pot.current_amount / pot.goal_amount) *
                            100
                          ).toFixed(2)}
                          <Percent className="w-4 h-4 ms-1" />
                        </h5>
                        <h4 className="text-sm font-light">
                          Target of{" "}
                          <span className="font-semibold">
                            {formatMoney(pot.goal_amount)}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        disabled={pot.current_amount === pot.goal_amount}
                        onClick={() => {
                          navigate(`/pots/deposit/${pot.id}`, {
                            state: { previousLocation: location },
                          });
                        }}
                      >
                        <Plus className="text-green-500" />
                        Add money
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        disabled={pot.current_amount === 0}
                        onClick={() => {
                          navigate(`/pots/withdraw/${pot.id}`, {
                            state: { previousLocation: location },
                          });
                        }}
                      >
                        <Minus className="text-red-500" />
                        Withdraw
                      </Button>
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
