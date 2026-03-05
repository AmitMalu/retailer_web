import { useCallback } from "react";

type TransactionEntry = {
  service: string;
  identifier: string;
  amount: number;
  timestamp: number;
};

const STORAGE_KEY = "recent_transactions";
const COOLDOWN_TIME = 120 * 1000;

const getTransactions = (): TransactionEntry[] => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = (transactions: TransactionEntry[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const cleanExpired = (transactions: TransactionEntry[]) => {
  const now = Date.now();
  return transactions.filter((txn) => now - txn.timestamp < COOLDOWN_TIME);
};

export const useTransactionCooldown = (service: string) => {
  // Check duplicate
  const checkDuplicate = useCallback(
    (identifier: string, amount: number): boolean => {
      let transactions = cleanExpired(getTransactions());

      const exists = transactions.some(
        (txn) =>
          txn.service === service &&
          txn.identifier === identifier &&
          txn.amount === amount,
      );

      // Save cleaned list (auto-expire old ones)
      saveTransactions(transactions);

      return exists;
    },
    [service],
  );

  // Store transaction
  const store = useCallback(
    (identifier: string, amount: number) => {
      let transactions = cleanExpired(getTransactions());

      transactions.push({
        service,
        identifier,
        amount,
        timestamp: Date.now(),
      });

      saveTransactions(transactions);
    },
    [service],
  );

  return { checkDuplicate, store };
};
