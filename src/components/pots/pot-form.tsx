"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthError } from "@firebase/auth";
import { ThemeColor } from "@/types/types";
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

interface IFormInputs {
  name: string;
  goal_amount: number;
  current_amount: number;
  theme: ThemeColor;
}

export function PotForm() {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      name: "",
      goal_amount: 0,
      current_amount: 0,
      theme: "green",
    },
  });
  const [error, setError] = useState<AuthError | null>(null);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const mutation = useMutation({
    mutationFn: async (data: IFormInputs) => {
      await addDoc(collection(db, "pots"), {
        name: data.name,
        goal_amount: data.goal_amount,
        current_amount: data.current_amount,
        theme: data.theme,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      reset();
      console.log("Pot added successfully");
      showAlert({
        title: "Heads up!",
        description: "Pot added successfully",
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
          New Pot
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          {error && (
            <p className="text-center text-red-500 font-light">
              {getFirebaseErrorMessage(error)}
            </p>
          )}
          <AlertDialogTitle>Add new pot</AlertDialogTitle>
          <AlertDialogDescription>
            Here you can add new pot.
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
              <Label className="text-sm font-light" htmlFor="goal_amount">
                Goal Amt
              </Label>
              <Controller
                name="goal_amount"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="goal_amount"
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
              {errors.goal_amount?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.goal_amount?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="current_amount">
                Current Amt
              </Label>
              <Controller
                name="current_amount"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="current_amount"
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
              {errors.goal_amount?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.goal_amount?.message}
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
