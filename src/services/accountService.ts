import db from "../database/db";

export function getMainAccount() {
  const account = db
    .prepare("SELECT * FROM accounts LIMIT 1")
    .get();

  return account;
}