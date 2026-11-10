const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const db = require("./database/db.cjs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:5173");

  win.webContents.openDevTools();
}

ipcMain.handle("get-balance", () => {
  const account = db
    .prepare("SELECT * FROM accounts LIMIT 1")
    .get();

  return account.balance;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.handle("add-transaction", (_, transaction) => {
  db.prepare(`
    INSERT INTO transactions (
      label,
      amount,
      date
    )
    VALUES (?, ?, ?)
  `).run(
    transaction.label,
    transaction.amount,
    transaction.date
  );

  return true;
});

ipcMain.handle("get-transactions", () => {
  return db
    .prepare(`
      SELECT *
      FROM transactions
      ORDER BY date DESC
    `)
    .all();
});

ipcMain.handle("delete-transaction", (_, id) => {
  db.prepare(`
    DELETE FROM transactions
    WHERE id = ?
  `).run(id);

  return true;
});


ipcMain.handle("get-recurring-transactions", () => {
  const rows = db
    .prepare(`
      SELECT *
      FROM recurring_transactions
      ORDER BY day_of_month
    `)
    .all();

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    amount: row.amount,
    dayOfMonth: row.day_of_month,
  }));
});

ipcMain.handle(
  "add-recurring-transaction",
  (_, recurring) => {
    db.prepare(`
      INSERT INTO recurring_transactions (
        label,
        amount,
        day_of_month
      )
      VALUES (?, ?, ?)
    `).run(
      recurring.label,
      recurring.amount,
      recurring.dayOfMonth
    );

    return true;
  }
);

ipcMain.handle(
  "delete-recurring-transaction",
  (_, id) => {
    db.prepare(`
      DELETE FROM recurring_transactions
      WHERE id = ?
    `).run(id);

    return true;
  }
);
