import { Link, useParams } from "react-router-dom";
import { usePhone } from "../api/hooks";
import { useCart } from "../hooks/useCart";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatFCFA } from "../utils/format";
import { UPLOADS_URL } from "../api/client";

export function PhoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: phone, isLoading, isError } = usePhone(id);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-sm text-dagno-inkSoft">
        Chargement...
      </div>
    );
  }

  if (isError || !phone) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-dagno-danger">
          Téléphone introuvable ou serveur indisponible.
        </p>
        <Link
          to="/telephones"
          className="mt-4 inline-block text-dagno-blue hover:underline"
        >
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  const image = phone.images[0];
  const outOfStock = phone.stock === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-dagno-inkSoft mb-6">
        <Link to="/telephones" className="hover:text-dagno-ink">
          Téléphones
        </Link>
        <span className="mx-2">/</span>
        <span className="text-dagno-ink">
          {phone.brand.name} {phone.model}
        </span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square bg-white border border-dagno-border rounded-md overflow-hidden grid place-items-center">
          {image ? (
            <img
              src={`${UPLOADS_URL}${image}`}
              alt={`${phone.brand.name} ${phone.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-dagno-inkSoft/50">
              {phone.brand.name} {phone.model}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge tone={phone.condition === "NEW" ? "blue" : "orange"}>
              {phone.condition === "NEW" ? "Neuf" : "Arrivage"}
            </Badge>
            {outOfStock ? (
              <Badge tone="red">Rupture de stock</Badge>
            ) : (
              <Badge tone="green">En stock ({phone.stock})</Badge>
            )}
          </div>

          <p className="text-sm text-dagno-inkSoft">{phone.brand.name}</p>
          <h1 className="font-display text-2xl md:text-3xl text-dagno-ink">
            {phone.model}
          </h1>

          <p className="mt-4 font-display text-2xl text-dagno-ink">
            {formatFCFA(phone.price)}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            {phone.storage && (
              <>
                <dt className="text-dagno-inkSoft">Stockage</dt>
                <dd className="text-dagno-ink">{phone.storage}</dd>
              </>
            )}
            {phone.color && (
              <>
                <dt className="text-dagno-inkSoft">Couleur</dt>
                <dd className="text-dagno-ink">{phone.color}</dd>
              </>
            )}
            <dt className="text-dagno-inkSoft">Garantie</dt>
            <dd className="text-dagno-ink">
              {phone.warrantyMonths > 0
                ? `${phone.warrantyMonths} mois`
                : "Aucune"}
            </dd>
          </dl>

          {phone.description && (
            <p className="mt-6 text-sm text-dagno-inkSoft leading-relaxed">
              {phone.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              disabled={outOfStock}
              onClick={() => {
                addItem({
                  id: phone.id,
                  type: "phone",
                  name: `${phone.brand.name} ${phone.model}${
                    phone.storage ? " " + phone.storage : ""
                  }`,
                  price: phone.price,
                  image: phone.images[0],
                });
              }}
            >
              {outOfStock ? "Indisponible" : "Ajouter au panier"}
            </Button>
            <a href="tel:+22364707523" className="inline-block">
              <Button variant="secondary">Appeler la boutique</Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-dagno-inkSoft">
            Paiement à la livraison pour les commandes livrées dans Bamako.
          </p>
        </div>
      </div>
    </div>
  );
}