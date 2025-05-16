"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesType, ThemeColor } from "@/types/types";
import { useAlert } from "@/providers/AlertProvider";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
  limit: number;
  spent: number;
  date: Date;
  category: CategoriesType;
  theme: ThemeColor;
}

export function BudgetsForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      limit: 0,
      spent: 0,
      date: new Date(),
      category: "entertainment",
      theme: "cyan",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const mutation = useMutation({
    mutationFn: async (data: IFormInputs) => {
      // Check if a budget with the same category already exists
      const q = query(
        collection(db, "budgets"),
        where("category", "==", data.category)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Duplicate budget please choose another category!");
      }

      // Validate limit and spent
      if (data.limit <= 0) {
        throw new Error("Budget limit must be greater than 0.");
      }
      if (data.spent < 0) {
        throw new Error("Spent amount cannot be negative.");
      }

      // Add the new budget
      const docRef = await addDoc(collection(db, "budgets"), {
        limit: data.limit,
        spent: data.spent,
        date: Timestamp.fromDate(data.date),
        category: data.category,
        theme: data.theme,
      });

      return docRef;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      reset();
      console.log("Budget added successfully");
      showAlert({
        title: "Heads up!",
        description: "Budget added successfully",
      });
      setError(null);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error.name);
        setError(error.message);
        showAlert({
          title: "Error",
          description: error.message,
        });
      } else {
        setError("An unknown error occurred");
        showAlert({
          title: "Error",
          description: "An unknown error occurred",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ms-4 cursor-pointer" variant="outline">
          <Plus className="h-4 w-4 text-green-500" />
          New Budget
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          {error && (
            <p className="text-center text-red-500 font-light">{error}</p>
          )}
          <AlertDialogTitle>Add new budget</AlertDialogTitle>
          <AlertDialogDescription>
            Here you can add new budgets.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="limit">
                Limit
              </Label>
              <Controller
                name="limit"
                control={control}
                rules={{
                  required: "Limit is required",
                  min: { value: 1, message: "Limit must be greater than 0" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="limit"
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
              {errors.limit?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.limit?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="spent">
                Spent
              </Label>
              <Controller
                name="spent"
                control={control}
                rules={{
                  required: "Spent amount is required",
                  min: { value: 0, message: "Spent amount cannot be negative" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="spent"
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
              {errors.spent?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.spent?.message}
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
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
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
                Category
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
              <Label className="text-sm font-light" htmlFor="theme">
                Theme
              </Label>
              <Controller
                name="theme"
                control={control}
                rules={{ required: "Theme is required" }}
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
                        <SelectLabel>Themes</SelectLabel>
                        <SelectItem value="red" className="text-red-500">
                          Red
                        </SelectItem>
                        <SelectItem value="orange" className="text-orange-500">
                          Orange
                        </SelectItem>
                        <SelectItem value="yellow" className="text-yellow-500">
                          Yellow
                        </SelectItem>
                        <SelectItem value="lime" className="text-lime-500">
                          Lime
                        </SelectItem>
                        <SelectItem value="green" className="text-green-500">
                          Green
                        </SelectItem>
                        <SelectItem
                          value="emerald"
                          className="text-emerald-500"
                        >
                          Emerald
                        </SelectItem>
                        <SelectItem value="teal" className="text-teal-500">
                          Teal
                        </SelectItem>
                        <SelectItem value="cyan" className="text-cyan-500">
                          Cyan
                        </SelectItem>
                        <SelectItem value="sky" className="text-sky-500">
                          Sky
                        </SelectItem>
                        <SelectItem value="blue" className="text-blue-500">
                          Blue
                        </SelectItem>
                        <SelectItem value="indigo" className="text-indigo-500">
                          Indigo
                        </SelectItem>
                        <SelectItem value="violet" className="text-violet-500">
                          Violet
                        </SelectItem>
                        <SelectItem value="purple" className="text-purple-500">
                          Purple
                        </SelectItem>
                        <SelectItem
                          value="fuchsia"
                          className="text-fuchsia-500"
                        >
                          Fuchsia
                        </SelectItem>
                        <SelectItem value="pink" className="text-pink-500">
                          Pink
                        </SelectItem>
                        <SelectItem value="rose" className="text-rose-500">
                          Rose
                        </SelectItem>
                        <SelectItem value="slate" className="text-slate-500">
                          Slate
                        </SelectItem>
                        <SelectItem value="gray" className="text-gray-500">
                          Gray
                        </SelectItem>
                        <SelectItem value="zinc" className="text-zinc-500">
                          Zinc
                        </SelectItem>
                        <SelectItem
                          value="neutral"
                          className="text-neutral-500"
                        >
                          Neutral
                        </SelectItem>
                        <SelectItem value="stone" className="text-stone-500">
                          Stone
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.theme?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.theme?.message}
                </p>
              )}
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
