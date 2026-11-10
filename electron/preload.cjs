const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getBalance: () => ipcRenderer.invoke("get-balance"),

  addTransaction: (transaction) =>
    ipcRenderer.invoke(
      "add-transaction",
      transaction
    ),

  getTransactions: () =>
    ipcRenderer.invoke(
      "get-transactions"
    ),

 deleteTransaction: (id) =>
  ipcRenderer.invoke(
    "delete-transaction",
    id
  ),

  getRecurringTransactions: () =>
  ipcRenderer.invoke(
    "get-recurring-transactions"
  ),

addRecurringTransaction: (recurring) =>
  ipcRenderer.invoke(
    "add-recurring-transaction",
    recurring
  ),

  deleteRecurringTransaction: (id) =>
  ipcRenderer.invoke(
    "delete-recurring-transaction",
    id
  ),

});