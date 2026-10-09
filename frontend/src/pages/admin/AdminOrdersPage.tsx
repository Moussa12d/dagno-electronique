import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Badge } from "../../components/ui/Badge";
import { formatFCFA, formatDate } from "../../utils/format";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; itemName: string; quantity: number; unitPrice: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  DELIVERED: "Livrée",
  PAID_ON_DELIVERY: "Payée à la livraison",
  CANCELLED: "Annulée",
};

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders", {
        params: { limit: 200 },
      });
      return data.data as Order[];
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-dagno-ink">Commandes</h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Suivi des commandes clients. Paiement à la livraison.
      </p>

      {isLoading && (
        <p className="mt-8 text-sm text-dagno-inkSoft">Chargement...</p>
      )}

      {orders && orders.length === 0 && (
        <div className="mt-8 bg-white border border-dagno-border rounded-md p-8 text-center text-sm text-dagno-inkSoft">
          Aucune commande pour l'instant. Les commandes arriveront ici dès que
          l'espace client sera actif (étape 9).
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-dagno-border rounded-md p-5"
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
                <Badge
                  tone={
                    o.status === "PAID_ON_DELIVERY"
                      ? "green"
                      : o.status === "CANCELLED"
                      ? "red"
                      : o.status === "PENDING"
                      ? "gray"
                      : "blue"
                  }
                >
                  {STATUS_LABELS[o.status] ?? o.status}
                </Badge>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-dagno-inkSoft">Client</p>
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-dagno-inkSoft">{o.customerPhone}</p>
                </div>
                <div>
                  <p className="text-dagno-inkSoft">Livraison</p>
                  <p>{o.deliveryAddress}</p>
                </div>
              </div>

              <div className="mt-3 border-t border-dagno-border pt-3">
                <p className="text-xs text-dagno-inkSoft mb-2">Articles</p>
                <ul className="space-y-1 text-sm">
                  {o.items.map((it) => (
                    <li
                      key={it.id}
                      className="flex justify-between text-dagno-ink"
                    >
                      <span>
                        {it.itemName} × {it.quantity}
                      </span>
                      <span>{formatFCFA(it.unitPrice * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="font-display">{formatFCFA(o.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}