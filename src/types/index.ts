export interface Account {
  id: number;
  name: string;
  balance: number;
}

export interface Transaction {
  id: number;
  label: string;
  amount: number;
  date: string;
}

export interface RecurringTransaction {
  id?: number;
  label: string;
  amount: number;
  day_of_month: number;
}