import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePhones, useBrands } from "../api/hooks";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatFCFA } from "../utils/format";
import { UPLOADS_URL } from "../api/client";
import type { Phone } from "../types";

export function TelephonesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const brand = searchParams.get("brand") ?? undefined;
  const condition =
    (searchParams.get("condition") as "NEW" | "REFURBISHED" | null) ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");

  const { data: brands } = useBrands();
  const { data, isLoading, isError } = usePhones({
    brand,
    condition,
    search: searchParams.get("search") ?? undefined,
    page,
    limit: 12,
  });

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("search", search.trim() || null);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-dagno-ink">
            Téléphones
          </h1>
          <p className="mt-1 text-sm text-dagno-inkSoft">
            Neufs et arrivages. Prix affichés en FCFA, garantie DAGNO.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher un modèle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none w-full md:w-64"
          />
          <Button type="submit" variant="secondary">
            Rechercher
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Filtres */}
        <aside className="space-y-6">
          <div>
            <p className="text-sm font-medium text-dagno-ink mb-2">Marque</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParam("brand", null)}
                className={`px-3 h-8 text-xs rounded border transition-colors ${
                  !brand
                    ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                    : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                }`}
              >
                Toutes
              </button>
              {brands?.map((b) => (
                <button
                  key={b.id}
                  onClick={() => updateParam("brand", b.slug)}
                  className={`px-3 h-8 text-xs rounded border transition-colors ${
                    brand === b.slug
                      ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                      : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-dagno-ink mb-2">État</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParam("condition", null)}
                className={`px-3 h-8 text-xs rounded border transition-colors ${
                  !condition
                    ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                    : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => updateParam("condition", "NEW")}
                className={`px-3 h-8 text-xs rounded border transition-colors ${
                  condition === "NEW"
                    ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                    : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                }`}
              >
                Neuf
              </button>
              <button
                onClick={() => updateParam("condition", "REFURBISHED")}
                className={`px-3 h-8 text-xs rounded border transition-colors ${
                  condition === "REFURBISHED"
                    ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                    : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                }`}
              >
                Arrivage
              </button>
            </div>
          </div>
        </aside>

        {/* Grille produits */}
        <div>
          {isLoading && (
            <p className="text-sm text-dagno-inkSoft">Chargement...</p>
          )}
          {isError && (
            <p className="text-sm text-dagno-danger">
              Impossible de charger les téléphones. Vérifiez que le serveur est
              démarré.
            </p>
          )}
          {data && data.data.length === 0 && (
            <p className="text-sm text-dagno-inkSoft">
              Aucun téléphone ne correspond à ces critères.
            </p>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((phone) => (
                  <PhoneCard key={phone.id} phone={phone} />
                ))}
              </div>

              {data.meta.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => updateParam("page", String(p))}
                        className={`w-9 h-9 text-sm rounded border transition-colors ${
                          p === data.meta.page
                            ? "bg-dagno-blue text-white border-dagno-blue"
                            : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneCard({ phone }: { phone: Phone }) {
  const image = phone.images[0];
  const outOfStock = phone.stock === 0;

  return (
    <Link
      to={`/telephones/${phone.id}`}
      className="group bg-white border border-dagno-border rounded-md shadow-card overflow-hidden flex flex-col hover:border-dagno-blue/40 transition-colors"
    >
      <div className="aspect-square bg-dagno-bg grid place-items-center overflow-hidden">
        {image ? (
          <img
            src={`${UPLOADS_URL}${image}`}
            alt={`${phone.brand.name} ${phone.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-dagno-inkSoft/50 text-sm">
            {phone.brand.name} {phone.model}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-dagno-inkSoft">{phone.brand.name}</span>
          <Badge tone={phone.condition === "NEW" ? "blue" : "orange"}>
            {phone.condition === "NEW" ? "Neuf" : "Arrivage"}
          </Badge>
        </div>
        <p className="font-medium text-dagno-ink leading-tight">
          {phone.model}
          {phone.storage && (
            <span className="text-dagno-inkSoft font-normal">
              {" "}
              · {phone.storage}
            </span>
          )}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display font-semibold text-dagno-ink">
            {formatFCFA(phone.price)}
          </span>
          {outOfStock ? (
            <span className="text-xs text-dagno-danger">Rupture</span>
          ) : (
            <span className="text-xs text-dagno-success">En stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}