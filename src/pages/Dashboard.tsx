import { useEffect, useState } from "react";

interface Transaction {
  id?: number;
  label: string;
  amount: number;
  date: string;
}

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
  }, []);

  const addTransaction = async () => {
    if (!label.trim() || !amount) {
      return;
    }

    await window.api.addTransaction({
      label,
      amount: Number(amount),
      date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setLabel("");
    setAmount("");

    loadTransactions();
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
        <h2>Ajouter une transaction</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
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
              key={
                transaction.id ??
                `${transaction.label}-${transaction.date}`
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <div>
                <strong>
                  {transaction.label}
                </strong>
                <br />
                <small>
                  {transaction.date}
                </small>
              </div>

              <div
                style={{
                  color:
                    transaction.amount >= 0
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {transaction.amount.toFixed(2)}
                €
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}