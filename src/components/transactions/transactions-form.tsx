"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { db } from "@/config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthError } from "@firebase/auth";
import { CategoriesType } from "@/types/types";
import { getFirebaseErrorMessage } from "@/types/authErrors";
import { useAlert } from "@/providers/AlertProvider";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


interface IFormInputs {
  name: string;
  date: Date;
  category: CategoriesType;
  amount: number;
  recurring: boolean;
}

export function TransactionForm() {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      recurring: false,
      amount: 0,
      name: "",
      date: new Date(),
      category: "entertainment",
    },
  });
  const [error, setError] = useState<AuthError | null>(null);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const mutation = useMutation({
    mutationFn: async (data: IFormInputs) => {
      await addDoc(collection(db, "transactions"), {
        name: data.name,
        date: Timestamp.fromDate(data.date),
        category: data.category,
        amount: data.amount,
        recurring: data.recurring,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      reset();
      console.log("Transaction added successfully");
      showAlert({
        title: "Heads up!",
        description: "Transaction added successfully",
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error as AuthError);
      } else {
        setError({
          code: "unknown",
          message: "An unknown error occurred",
        } as AuthError);
      }
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <AlertDialog>
      <AlertDialogOverlay />
      <AlertDialogTrigger asChild>
        <Button className="ms-4 cursor-pointer" variant="outline">
          <Plus className="h-4 w-4 text-green-500" />
          New Transaction
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          {error && (
            <p className="text-center text-red-500 font-light">
              {getFirebaseErrorMessage(error)}
            </p>
          )}
          <AlertDialogTitle>Add new transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Here you can add new transactions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="name">
                Name
              </Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Transaction made for"
                required
              />
              {errors.name?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="date">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.date?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="type">
                Type
              </Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="bill">Bills</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="dining-out">Dining Out</SelectItem>
                        <SelectItem value="transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="personal-care">
                          Personal Care
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.category?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="amount">
                Amount
              </Label>
              <Controller
                name="amount"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="amount"
                    type="number"
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
              {errors.amount?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.amount?.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox {...register("recurring")} id="recurring" />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recurring
              </label>
            </div>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              onClick={() => {
                reset();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={mutation.isPending}>
              <span>{mutation.isPending ? "Submitting..." : "Submit"}</span>
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}