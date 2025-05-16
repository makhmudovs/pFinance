export type ThemeColor =
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

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

export interface PotDetailsFormTypes {
  name: string;
  goal_amount: number;
  current_amount: number;
  theme: ThemeColor;
}

export interface PotDepositTypes {
  goal_amount: number;
  current_amount: number;
  amount:number;
}


export interface BudgetsType {
  id: string;
  limit: number;
  spent: number;
  category: CategoriesType;
  theme: ThemeColor;
  [key: string]: unknown;
}

export interface PotsType {
  id: string;
  name: string;
  goal_amount: number;
  current_amount: number;
  theme: ThemeColor;
  [key: string]: unknown;
}
