import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { PotDepositTypes } from "@/types/types";
import { useAlert } from "@/providers/AlertProvider";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader } from "../shared/loader";
import { depositPot, fetchPot } from "@/services/pots";

export function PotDeposit() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PotDepositTypes>({
    defaultValues: {
      goal_amount: 0,
      current_amount: 0,
      amount: 0,
    },
  });

  const modalRef2 = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pot", id],
    queryFn: () => fetchPot(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      reset({
        goal_amount: data.goal_amount,
        current_amount: data.current_amount,
      });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: PotDepositTypes }) =>
      depositPot(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pot", id] });
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      showAlert({
        title: "Success",
        description: "Deposit added successfully.",
      });
      navigate("/pots");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      showAlert({
        title: "Error",
        description: errorMessage,
      });
    },
  });

  const onSubmit = (formData: PotDepositTypes) => {
    if (!id) {
      showAlert({
        title: "Error",
        description: "Pot ID is missing.",
      });
      return;
    }

    const newCurrentAmount = formData.current_amount + formData.amount;
    if (newCurrentAmount > formData.goal_amount) {
      setErrorMsg(
        `Deposit would exceed the goal amount of $${
          formData.goal_amount
        }. You can deposit up to $${
          formData.goal_amount - formData.current_amount
        }.`
      );
      return;
    }

    setErrorMsg(null);
    updateMutation.mutate({ id, formData });
  };

  useEffect(() => {
    const observerRefValue = modalRef2.current;
    if (observerRefValue) {
      disableBodyScroll(observerRefValue);
    }

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading pot: {error.message}</div>;

  return (
    <motion.div
      ref={modalRef2}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => navigate("/pots")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {errorMsg && (
          <p className="text-red-500 text-sm font-light p-4">{errorMsg}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Add Money</CardTitle>
            <CardDescription>Deposit for pot {id}.</CardDescription>
            <p className="text-sm text-gray-500">
              Current: ${data?.current_amount} / Goal: ${data?.goal_amount}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="amount">
                Amount to Deposit
              </Label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Deposit amount is required",
                  min: {
                    value: 0.01,
                    message: "Deposit amount must be greater than 0",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedValue =
                        value === "" ? undefined : parseFloat(value) || 0;
                      field.onChange(parsedValue);
                    }}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm font-light">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/pots")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Deposit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
