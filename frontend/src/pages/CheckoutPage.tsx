import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { formatFCFA } from "../utils/format";

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user ? `${user.firstName} ${user.lastName}` : "",
    customerPhone: user?.phone ?? "",
    deliveryAddress: "",
    city: "Bamako",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/connexion?redirect=/commande" replace />;
  }
  if (items.length === 0) {
    return <Navigate to="/panier" replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/orders", {
        ...form,
        items: items.map((i) => ({
          phoneId: i.type === "phone" ? i.id : undefined,
          accessoryId: i.type === "accessory" ? i.id : undefined,
          quantity: i.quantity,
        })),
      });
      clear();
      navigate(`/mon-compte/commande/${data.data.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.error ?? "Erreur lors de la commande."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-dagno-ink">
        Finaliser la commande
      </h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            required
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
          />
          <Input
            label="Téléphone"
            required
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
          />
          <Input
            label="Adresse de livraison"
            required
            placeholder="Quartier, rue, repère..."
            value={form.deliveryAddress}
            onChange={(e) =>
              setForm({ ...form, deliveryAddress: e.target.value })
            }
          />
          <Input
            label="Ville"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dagno-ink">
              Notes (facultatif)
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="px-3 py-2 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-dagno-danger">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Confirmer la commande
          </Button>

          <p className="text-xs text-dagno-inkSoft text-center">
            Paiement à la livraison. Nous vous appelons pour confirmer.
          </p>
        </form>

        <aside className="bg-white border border-dagno-border rounded-md shadow-card p-5 h-fit sticky top-24">
          <h2 className="font-display text-lg">Votre commande</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span className="text-dagno-inkSoft truncate pr-2">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatFCFA(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-dagno-border flex justify-between font-display font-semibold">
            <span>Total</span>
            <span>{formatFCFA(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}