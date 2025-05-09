export type CategoriesType =
  | "entertainment"
  | "bills"
  | "groceries"
  | "dining-out"
  | "transportation"
  | "personal-care"
  | "education"
  | "lifestyle"
  | "shopping"
  | "general";

export interface TransactionsType {
  id: string;
  amount: number;
  category: CategoriesType;
  date: string; // Store the formatted date as a string
  name: string;
  recurring: boolean;
  email: string;
  [key: string]: unknown;
}

export interface TransactionDetailsFormTypes {
  name: string;
  date: string;
  category: CategoriesType;
  amount: number;
  recurring: boolean;
}