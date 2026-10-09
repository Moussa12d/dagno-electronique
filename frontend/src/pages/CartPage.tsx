import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Button } from "../components/ui/Button";
import { formatFCFA } from "../utils/format";
import { UPLOADS_URL } from "../api/client";

export function CartPage() {
  const { items, removeItem, updateQuantity, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-dagno-ink">Votre panier</h1>
        <p className="mt-3 text-dagno-inkSoft">Votre panier est vide.</p>
        <Link
          to="/telephones"
          className="mt-6 inline-flex h-10 px-4 items-center rounded bg-dagno-blue text-white text-sm font-medium hover:bg-dagno-blueDark"
        >
          Parcourir les téléphones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-dagno-ink">Votre panier</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-dagno-border rounded-md p-3 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded bg-dagno-bg grid place-items-center overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={`${UPLOADS_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-dagno-inkSoft text-center px-1">
                    {item.name}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dagno-ink text-sm line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-dagno-inkSoft">
                  {formatFCFA(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-dagno-border hover:border-dagno-blue text-sm"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-dagno-border hover:border-dagno-blue text-sm"
                >
                  +
                </button>
              </div>
              <div className="w-24 text-right font-display font-semibold text-sm">
                {formatFCFA(item.price * item.quantity)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-dagno-danger text-xs hover:underline"
              >
                Retirer
              </button>
            </div>
          ))}

          <button
            onClick={clear}
            className="text-xs text-dagno-inkSoft hover:text-dagno-danger mt-2"
          >
            Vider le panier
          </button>
        </div>

        <aside className="bg-white border border-dagno-border rounded-md shadow-card p-5 h-fit sticky top-24">
          <h2 className="font-display text-lg">Récapitulatif</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-dagno-inkSoft">
              <span>Sous-total</span>
              <span>{formatFCFA(total)}</span>
            </div>
            <div className="flex justify-between text-dagno-inkSoft">
              <span>Livraison</span>
              <span>À convenir</span>
            </div>
            <div className="flex justify-between font-display font-semibold text-dagno-ink pt-2 border-t border-dagno-border">
              <span>Total</span>
              <span>{formatFCFA(total)}</span>
            </div>
          </div>

          <Link to="/commande" className="block mt-5">
            <Button className="w-full">Passer la commande</Button>
          </Link>

          <p className="mt-3 text-xs text-dagno-inkSoft">
            Paiement à la livraison. Nous vous appelons pour confirmer avant
            livraison.
          </p>
        </aside>
      </div>
    </div>
  );
}