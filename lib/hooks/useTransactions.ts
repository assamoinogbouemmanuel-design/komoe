"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionsApi, type Transaction, type TransactionListFilters } from "@/lib/api";

// ─── Status label helpers ─────────────────────────────────────────────────────

export const STATUT_LABELS: Record<string, string> = {
  VALIDE:    "Confirmé",
  SOUMIS:    "En attente",
  BROUILLON: "Brouillon",
  REJETE:    "Rejeté",
};

export const STATUT_VARIANT: Record<string, "success" | "secondary" | "outline" | "destructive"> = {
  VALIDE:    "success",
  SOUMIS:    "secondary",
  BROUILLON: "outline",
  REJETE:    "destructive",
};

// ─── Hook : liste publique (VALIDE seulement) avec filtres ────────────────────

export function useTransactionsList(filters?: TransactionListFilters, enabled = true) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const commune = filters?.commune;
  const type = filters?.type;
  const statut = filters?.statut;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await transactionsApi.list({ commune, type, statut });
      setTransactions(res.results ?? []);
      setCount(res.count ?? 0);
    } catch {
      setError("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  }, [enabled, commune, type, statut]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { transactions, count, loading, error, refetch: fetchData };
}

// ─── Hook : transactions d'une commune (authentifié = tous statuts) ───────────

export function useCommuneTransactions(
  communeId: number | null,
  filters?: { statut?: string; type?: "DEPENSE" | "RECETTE" }
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(!!communeId);
  const [error, setError] = useState<string | null>(null);

  const statut = filters?.statut;
  const type = filters?.type;

  const fetchData = useCallback(async () => {
    if (!communeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await transactionsApi.byCommune(communeId, { statut, type });
      setTransactions(res.results ?? []);
      setCount(res.count ?? 0);
    } catch {
      setError("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  }, [communeId, statut, type]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { transactions, count, loading, error, refetch: fetchData };
}

// ─── Hook : détail d'une transaction ─────────────────────────────────────────

export function useTransactionDetail(id: string | null) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    transactionsApi.detail(id)
      .then(setTransaction)
      .catch(() => setError("Transaction introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { refetch(); }, [refetch]);

  return { transaction, loading, error, refetch };
}
