interface Transaction {
  id?: number;
  label: string;
  amount: number;
  date: string;
}

interface Window {
  api: {
    getBalance: () => Promise<number>;
    getTransactions: () => Promise<Transaction[]>;
    addTransaction: (
      transaction: Transaction
    ) => Promise<boolean>;
  };
}