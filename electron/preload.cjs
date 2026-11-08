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
});