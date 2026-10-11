import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatFCFA, formatDate } from "../utils/format";
import { useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; itemName: string; quantity: number; unitPrice: number }[];
}

interface Ticket {
  id: string;
  ticketNumber: string;
  phoneModel: string;
  status: string;
  quotedPrice: number | null;
  createdAt: string;
  repairType: { name: string };
}

const ORDER_STATUS: Record<string, { label: string; tone: any }> = {
  PENDING: { label: "En attente", tone: "gray" },
  CONFIRMED: { label: "Confirmée", tone: "blue" },
  DELIVERED: { label: "Livrée", tone: "orange" },
  PAID_ON_DELIVERY: { label: "Confirmée par vous", tone: "green" },
  CANCELLED: { label: "Annulée", tone: "red" },
};

const REPAIR_STATUS: Record<string, string> = {
  PENDING: "En attente",
  DIAGNOSING: "Diagnostic",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
};

export function AccountPage() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/me");
      return data.data as Order[];
    },
    enabled: !!user,
  });

  const { data: tickets } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: async () => {
      const { data } = await api.get("/me/repair-tickets");
      return data.data as Ticket[];
    },
    enabled: !!user,
  });

  async function confirmReceipt(orderId: string) {
    if (
      !confirm(
        "Confirmez-vous avoir reçu cette commande et l'avoir payée à la livraison ?"
      )
    )
      return;

    setConfirmingId(orderId);
    try {
      await api.patch(`/orders/me/${orderId}/confirm-receipt`);
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    } catch (err: any) {
      alert(
        err.response?.data?.error ??
          "Erreur lors de la confirmation de la commande."
      );
    } finally {
      setConfirmingId(null);
    }
  }

  if (!user) return <Navigate to="/connexion?redirect=/mon-compte" replace />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-dagno-ink">Mon compte</h1>
          <p className="mt-1 text-sm text-dagno-inkSoft">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-dagno-danger hover:underline"
        >
          Se déconnecter
        </button>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg">Mes commandes</h2>
        {!orders || orders.length === 0 ? (
          <p className="mt-3 text-sm text-dagno-inkSoft">
            Aucune commande pour l'instant.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((o) => {
              const st = ORDER_STATUS[o.status] ?? {
                label: o.status,
                tone: "gray",
              };
              const canConfirm =
                o.status === "CONFIRMED" || o.status === "DELIVERED";
              return (
                <div
                  key={o.id}
                  className="bg-white border border-dagno-border rounded-md p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-medium">
                        {o.orderNumber}
                      </p>
                      <p className="text-xs text-dagno-inkSoft">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <ul className="mt-3 text-sm space-y-1">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex justify-between">
                        <span>
                          {it.itemName} × {it.quantity}
                        </span>
                        <span>
                          {formatFCFA(it.unitPrice * it.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-dagno-border flex flex-wrap justify-between items-center gap-3">
                    <span className="font-display font-semibold">
                      Total : {formatFCFA(o.total)}
                    </span>
                    {canConfirm && (
                      <Button
                        size="sm"
                        onClick={() => confirmReceipt(o.id)}
                        loading={confirmingId === o.id}
                      >
                        J'ai reçu ma commande
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg">Mes réparations</h2>
        {!tickets || tickets.length === 0 ? (
          <p className="mt-3 text-sm text-dagno-inkSoft">
            Aucun ticket de réparation lié à votre compte.
          </p>
        ) : (
          <div className="mt-4 border border-dagno-border rounded-md overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Ticket</th>
                  <th className="px-4 py-2 font-medium">Téléphone</th>
                  <th className="px-4 py-2 font-medium">Panne</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 font-medium text-right">Prix</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-dagno-border">
                    <td className="px-4 py-3 font-mono text-xs">
                      {t.ticketNumber}
                    </td>
                    <td className="px-4 py-3">{t.phoneModel}</td>
                    <td className="px-4 py-3">{t.repairType.name}</td>
                    <td className="px-4 py-3">
                      {REPAIR_STATUS[t.status] ?? t.status}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.quotedPrice != null ? (
                        formatFCFA(t.quotedPrice)
                      ) : (
                        <span className="text-xs text-dagno-inkSoft">
                          Après examen
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}