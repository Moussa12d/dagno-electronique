import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccessories, useAccessoryCategories } from "../api/hooks";
import { useCart } from "../hooks/useCart";
import { Button } from "../components/ui/Button";
import { formatFCFA } from "../utils/format";
import { UPLOADS_URL } from "../api/client";

export function AccessoiresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const { addItem } = useCart();

  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");

  const { data: categories } = useAccessoryCategories();
  const { data, isLoading, isError } = useAccessories({
    category,
    search: searchParams.get("search") ?? undefined,
    page,
    limit: 16,
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
            Accessoires
          </h1>
          <p className="mt-1 text-sm text-dagno-inkSoft">
            Coques, chargeurs, écouteurs, protections d'écran, power banks.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none w-full md:w-64"
          />
          <Button type="submit" variant="secondary">
            Rechercher
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => updateParam("category", null)}
          className={`px-3 h-8 text-xs rounded border transition-colors ${
            !category
              ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
              : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
          }`}
        >
          Toutes
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => updateParam("category", c.slug)}
            className={`px-3 h-8 text-xs rounded border transition-colors ${
              category === c.slug
                ? "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/30"
                : "bg-white text-dagno-inkSoft border-dagno-border hover:border-dagno-ink/30"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading && (
          <p className="text-sm text-dagno-inkSoft">Chargement...</p>
        )}
        {isError && (
          <p className="text-sm text-dagno-danger">
            Impossible de charger les accessoires.
          </p>
        )}
        {data && data.data.length === 0 && (
          <p className="text-sm text-dagno-inkSoft">
            Aucun accessoire ne correspond à ces critères.
          </p>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.data.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border border-dagno-border rounded-md shadow-card overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-dagno-bg grid place-items-center overflow-hidden">
                    {a.images[0] ? (
                      <img
                        src={`${UPLOADS_URL}${a.images[0]}`}
                        alt={a.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-dagno-inkSoft/60 px-2 text-center">
                        {a.name}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-xs text-dagno-inkSoft">
                      {a.category.name}
                    </p>
                    <p className="text-sm font-medium text-dagno-ink leading-tight line-clamp-2">
                      {a.name}
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="font-display font-semibold text-sm">
                        {formatFCFA(a.price)}
                      </span>
                      {a.stock === 0 ? (
                        <span className="text-xs text-dagno-danger">Rupture</span>
                      ) : (
                        <button
                          onClick={() =>
                            addItem({
                              id: a.id,
                              type: "accessory",
                              name: a.name,
                              price: a.price,
                              image: a.images[0],
                            })
                          }
                          className="text-xs text-dagno-blue hover:underline font-medium"
                        >
                          Ajouter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from(
                  { length: data.meta.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
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
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}