

interface Window {
  api: {
    getBalance: () => Promise<number>;

    getTransactions: () => Promise<Transaction[]>;
    addTransaction: (
      transaction: Transaction
    ) => Promise<boolean>;
    deleteTransaction: (
      id: number
    ) => Promise<boolean>;

    getRecurringTransactions: () => Promise<
      RecurringTransaction[]
    >;

    addRecurringTransaction: (
      recurring: RecurringTransaction
    ) => Promise<boolean>;

    deleteRecurringTransaction: (
      id: number
    ) => Promise<boolean>;
  };
}