import { Link } from "react-router-dom";
import { usePhones, useRepairTypes, useFeaturedPhones } from "../api/hooks";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatFCFA } from "../utils/format";
import { UPLOADS_URL } from "../api/client";

export function HomePage() {
  const { data: phones } = usePhones({ limit: 12, inStock: true });
  const { data: repairTypes } = useRepairTypes();
  const { data: featured } = useFeaturedPhones();

  return (
    <div>
      {/* HERO */}
      <section className="bg-white border-b border-dagno-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Badge tone="blue">Bamako · Dravela-Bolibana</Badge>
            <h1 className="mt-4 font-display text-3xl md:text-5xl text-dagno-ink leading-tight">
              Téléphones, accessoires et réparation
              <br />
              <span className="text-dagno-blue">au même endroit.</span>
            </h1>
            <p className="mt-5 text-dagno-inkSoft max-w-lg">
              Neufs et arrivages, toutes marques. Réparation rapide,
              diagnostic en boutique, garantie DAGNO ELECTRONIQUE.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/telephones">
                <Button size="lg">Voir les téléphones</Button>
              </Link>
              <Link to="/reparation">
                <Button size="lg" variant="secondary">
                  Demander un devis
                </Button>
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <dt className="text-xs text-dagno-inkSoft uppercase tracking-wide">
                  Marques
                </dt>
                <dd className="mt-1 font-display text-xl text-dagno-ink">5+</dd>
              </div>
              <div>
                <dt className="text-xs text-dagno-inkSoft uppercase tracking-wide">
                  Modèles
                </dt>
                <dd className="mt-1 font-display text-xl text-dagno-ink">30+</dd>
              </div>
              <div>
                <dt className="text-xs text-dagno-inkSoft uppercase tracking-wide">
                  Réparations
                </dt>
                <dd className="mt-1 font-display text-xl text-dagno-ink">10</dd>
              </div>
            </dl>
          </div>

          {/* GRILLE DES PRODUITS PHARES ANIMÉE */}
          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((p, index) => {
                const isAlt = index === 1 || index === 3;
                return (
                  <Link
                    key={p.id}
                    to={`/telephones/${p.id}`}
                    className={`hero-card hero-card-${index + 1} group relative bg-white border border-dagno-border rounded-md overflow-hidden hover:border-dagno-blue/40 hover:shadow-lg transition-all duration-300 ${
                      isAlt ? "mt-6" : ""
                    }`}
                    style={{ animationFillMode: "forwards" }}
                  >
                    {/* Wrapper interne pour le flottement */}
                    <div
                      className={isAlt ? "hero-float-alt" : "hero-float"}
                      style={{ animationDelay: `${index * 0.4}s` }}
                    >
                      <div className="aspect-square bg-dagno-bg grid place-items-center overflow-hidden">
                        {p.images[0] ? (
                          <img
                            src={`${UPLOADS_URL}${p.images[0]}`}
                            alt={`${p.brand.name} ${p.model}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="font-display text-dagno-inkSoft text-lg">
                            {p.brand.name}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-dagno-inkSoft">
                          {p.brand.name}
                        </p>
                        <p className="text-sm font-medium text-dagno-ink line-clamp-1">
                          {p.model}
                        </p>
                        <p className="mt-1 font-display font-semibold text-sm">
                          {formatFCFA(p.price)}
                        </p>
                      </div>
                    </div>

                    {/* Reflet lumineux qui traverse au survol */}
                    <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:left-[200%] transition-all duration-1000 ease-out" />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-dagno-bg rounded-md grid place-items-center border border-dagno-border hero-float">
                <span className="font-display text-dagno-inkSoft text-lg">
                  Apple
                </span>
              </div>
              <div className="aspect-square bg-dagno-bg rounded-md grid place-items-center border border-dagno-border mt-6 hero-float-alt">
                <span className="font-display text-dagno-inkSoft text-lg">
                  Samsung
                </span>
              </div>
              <div className="aspect-square bg-dagno-bg rounded-md grid place-items-center border border-dagno-border hero-float">
                <span className="font-display text-dagno-inkSoft text-lg">
                  Xiaomi
                </span>
              </div>
              <div className="aspect-square bg-dagno-bg rounded-md grid place-items-center border border-dagno-border mt-6 hero-float-alt">
                <span className="font-display text-dagno-inkSoft text-lg">
                  Tecno
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3 CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/telephones"
            className="group bg-white border border-dagno-border rounded-md shadow-card p-6 hover:border-dagno-blue/40 transition-colors"
          >
            <p className="font-display font-semibold text-dagno-ink text-lg">
              Téléphones
            </p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              Apple, Samsung, Xiaomi, Tecno, Infinix — neufs et arrivages.
            </p>
            <p className="mt-4 text-sm text-dagno-blue font-medium group-hover:underline">
              Voir le catalogue →
            </p>
          </Link>

          <Link
            to="/accessoires"
            className="group bg-white border border-dagno-border rounded-md shadow-card p-6 hover:border-dagno-blue/40 transition-colors"
          >
            <p className="font-display font-semibold text-dagno-ink text-lg">
              Accessoires
            </p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              Coques, chargeurs, écouteurs, protections d'écran, power banks.
            </p>
            <p className="mt-4 text-sm text-dagno-blue font-medium group-hover:underline">
              Voir les accessoires →
            </p>
          </Link>

          <Link
            to="/reparation"
            className="group bg-white border border-dagno-border rounded-md shadow-card p-6 hover:border-dagno-blue/40 transition-colors"
          >
            <p className="font-display font-semibold text-dagno-ink text-lg">
              Réparation
            </p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              Écran, batterie, connecteur, désoxydation. Diagnostic en boutique.
            </p>
            <p className="mt-4 text-sm text-dagno-blue font-medium group-hover:underline">
              Demander un devis →
            </p>
          </Link>
        </div>
      </section>

      {/* TELEPHONES EN STOCK — CARROUSEL INFINI */}
      {phones && phones.data.length > 0 && (
        <section className="bg-white border-y border-dagno-border py-12 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl text-dagno-ink">
                  En stock maintenant
                </h2>
                <p className="mt-1 text-sm text-dagno-inkSoft">
                  Sélection disponible immédiatement en boutique.
                </p>
              </div>
              <Link
                to="/telephones"
                className="text-sm text-dagno-blue hover:underline whitespace-nowrap hidden sm:inline"
              >
                Voir tout →
              </Link>
            </div>
          </div>

          <div className="marquee">
            {[0, 1].map((copy) => (
              <div
                className="marquee__track"
                key={copy}
                aria-hidden={copy === 1}
              >
                {phones.data.map((p) => (
                  <Link
                    key={`${copy}-${p.id}`}
                    to={`/telephones/${p.id}`}
                    className="group bg-white border border-dagno-border rounded-md overflow-hidden hover:border-dagno-blue/40 transition-colors w-[180px] sm:w-[200px] shrink-0"
                  >
                    <div className="aspect-square bg-dagno-bg grid place-items-center overflow-hidden">
                      {p.images[0] ? (
                        <img
                          src={`${UPLOADS_URL}${p.images[0]}`}
                          alt={`${p.brand.name} ${p.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs text-dagno-inkSoft/60 px-2 text-center">
                          {p.brand.name} {p.model}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-dagno-inkSoft">
                        {p.brand.name}
                      </p>
                      <p className="text-sm font-medium text-dagno-ink line-clamp-1">
                        {p.model}
                      </p>
                      <p className="mt-1 font-display font-semibold text-sm">
                        {formatFCFA(p.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-6 sm:hidden">
            <Link to="/telephones">
              <Button variant="secondary" className="w-full">
                Voir tout le catalogue
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* REPARATION */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl text-dagno-ink">
              Réparation rapide, devis après examen.
            </h2>
            <p className="mt-3 text-sm text-dagno-inkSoft max-w-lg">
              Apportez votre téléphone en boutique. Nous l'examinons, puis nous
              vous communiquons le prix exact. Vous suivez l'avancement en
              ligne par numéro de ticket. Aucun frais si vous refusez le devis.
            </p>
            <Link to="/reparation" className="mt-6 inline-block">
              <Button>Demander un devis</Button>
            </Link>
          </div>

          {repairTypes && (
            <div className="border border-dagno-border rounded-md overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">
                      Interventions proposées
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repairTypes.slice(0, 5).map((t) => (
                    <tr key={t.id} className="border-t border-dagno-border">
                      <td className="px-4 py-3 text-dagno-ink">{t.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-dagno-border bg-dagno-bg text-xs text-dagno-inkSoft">
                Prix communiqué après examen en boutique.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INFOS PRATIQUES */}
      <section className="bg-white border-t border-dagno-border">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
          <div>
            <p className="font-display font-semibold text-dagno-ink">Adresse</p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              Dravela-Bolibana
              <br />
              Bamako, Mali
            </p>
          </div>
          <div>
            <p className="font-display font-semibold text-dagno-ink">
              Horaires
            </p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              Lun – Ven : 8h – 20h
              <br />
              Samedi : 9h – 20h
              <br />
              Dimanche : fermé
            </p>
          </div>
          <div>
            <p className="font-display font-semibold text-dagno-ink">
              Téléphone
            </p>
            <p className="mt-2 text-sm text-dagno-inkSoft">
              <a href="tel:+22364707523" className="hover:text-dagno-ink">
                +223 64 70 75 23
              </a>
              <br />
              <a
                href="mailto:oumardagnon94@gmail.com"
                className="hover:text-dagno-ink"
              >
                oumardagnon94@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}