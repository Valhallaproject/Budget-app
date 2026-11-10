import { useEffect, useState } from "react";

interface Transaction {
  id?: number;
  label: string;
  amount: number;
  date: string;
}

interface RecurringTransaction {
  id?: number;
  label: string;
  amount: number;
  dayOfMonth: number;
}

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [recurringTransactions, setRecurringTransactions] =
  useState<RecurringTransaction[]>([]);
const [forecastBalance, setForecastBalance] = useState(0);
const [recurringLabel, setRecurringLabel] = useState("");
const [recurringAmount, setRecurringAmount] = useState("");
const [dayOfMonth, setDayOfMonth] = useState("");
const [remainingRecurringAmount, setRemainingRecurringAmount] =
  useState(0);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const loadTransactions = async () => {
    const data = await window.api.getTransactions();

    setTransactions(data);

    const total = data.reduce(
      (sum: number, transaction: Transaction) =>
        sum + transaction.amount,
      0
    );

    setBalance(total);
  };

 useEffect(() => {
  loadTransactions();
  loadRecurringTransactions();
}, []);

useEffect(() => {
  const today = new Date().getDate();

  const remainingRecurring =
    recurringTransactions.filter(
      (item) =>
        item.dayOfMonth >= today
    );

  const recurringTotal =
    remainingRecurring.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  setRemainingRecurringAmount(
    recurringTotal
  );

  setForecastBalance(
    balance - recurringTotal
  );
}, [balance, recurringTransactions]);

  const addTransaction = async () => {
    if (!label.trim() || !amount) {
      return;
    }

    await window.api.addTransaction({
    label,
    amount: Number(amount),
    date,
    });

    setLabel("");
    setAmount("");

    loadTransactions();
  };

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
    );

  const deleteTransaction = async (id: number) => {
    await window.api.deleteTransaction(id);

    loadTransactions();
  };

  const loadRecurringTransactions = async () => {
    const data: RecurringTransaction[] =
      await window.api.getRecurringTransactions();

    setRecurringTransactions(data);

    const today = new Date().getDate();

    const remainingRecurring: RecurringTransaction[] =
      data.filter(
        (item: RecurringTransaction) =>
          item.dayOfMonth >= today
      );

    const recurringTotal: number = remainingRecurring.reduce<number>(
      (sum: number, item: RecurringTransaction) =>
        sum + Number(item.amount),
      0
    );

    setForecastBalance(
      Number(balance) - recurringTotal
    );
  };

  const addRecurringTransaction = async () => {
    console.log("CLICK RECURRING");
  if (
    !recurringLabel ||
    !recurringAmount ||
    !dayOfMonth
  ) {
    return;
  }

  await window.api.addRecurringTransaction({
    label: recurringLabel,
    amount: Number(recurringAmount),
    dayOfMonth: Number(dayOfMonth),
  });

  setRecurringLabel("");
  setRecurringAmount("");
  setDayOfMonth("");

  loadRecurringTransactions();
};

const deleteRecurringTransaction = async (
  id: number
) => {
  await window.api.deleteRecurringTransaction(
    id
  );

  loadRecurringTransactions();
};

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Budget App</h1>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>Solde actuel</h2>

        <p
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          {balance.toFixed(2)} €
        </p>
      </div>

      <div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <h2>Prélèvements restants</h2>

  <p
    style={{
      fontSize: "2rem",
      fontWeight: "bold",
      color: "orange",
    }}
  >
    {remainingRecurringAmount.toFixed(2)} €
  </p>
</div>

      <div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <h2>Ajouter un prélèvement récurrent</h2>

  <div
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <input
      placeholder="Libellé"
      value={recurringLabel}
      onChange={(e) =>
        setRecurringLabel(e.target.value)
      }
    />

    <input
      type="number"
      placeholder="Montant"
      value={recurringAmount}
      onChange={(e) =>
        setRecurringAmount(e.target.value)
      }
    />

    <input
      type="number"
      min="1"
      max="31"
      placeholder="Jour"
      value={dayOfMonth}
      onChange={(e) =>
        setDayOfMonth(e.target.value)
      }
    />

    <button
      onClick={addRecurringTransaction}
    >
      Ajouter
    </button>
  </div>
</div>

<div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <h2>Prélèvements récurrents</h2>

  {recurringTransactions.map((item) => (
  <div
    key={item.id}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <div>
      <strong>{item.label}</strong>
      <br />
      <small>
        Prélevé le {item.dayOfMonth}
      </small>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          color: "red",
        }}
      >
        {item.amount.toFixed(2)} €
      </span>

      <button
        onClick={() =>
          deleteRecurringTransaction(item.id!)
        }
        style={{
          cursor: "pointer",
        }}
      >
        🗑️
      </button>
    </div>
  </div>
))}
</div>

      <div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <h2>Solde prévisionnel</h2>

  <p
    style={{
      fontSize: "2rem",
      fontWeight: "bold",
      color:
        forecastBalance >= 0
          ? "green"
          : "red",
    }}
  >
    {forecastBalance.toFixed(2)} €
  </p>
</div>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>Ajouter une transaction</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            />
          <input
            type="text"
            placeholder="Libellé"
            value={label}
            onChange={(e) =>
              setLabel(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <button onClick={addTransaction}>
            Ajouter
          </button>
        </div>

        <small>
          Utilise un montant négatif pour une
          dépense.
        </small>
      </div>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>Transactions</h2>

        {transactions.length === 0 ? (
          <p>Aucune transaction</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{transaction.label}</strong>
                <br />
                <small>{transaction.date}</small>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color:
                      transaction.amount >= 0
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {transaction.amount.toFixed(2)} €
                </span>

                <button
                  onClick={() => deleteTransaction(transaction.id!)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}