import { Link } from "react-router-dom";

export function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-xs uppercase tracking-wide text-dagno-inkSoft">
        Dernière mise à jour : 11 octobre 2026
      </p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-dagno-ink">
        Mentions légales
      </h1>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-dagno-inkSoft">
        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            Éditeur du site
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <strong className="text-dagno-ink">Nom commercial :</strong>{" "}
              DAGNO ELECTRONIQUE
            </li>
            <li>
              <strong className="text-dagno-ink">Activité :</strong> Vente de
              téléphones, accessoires et service de réparation
            </li>
            <li>
              <strong className="text-dagno-ink">Adresse :</strong>{" "}
              Dravela-Bolibana, Bamako, Mali
            </li>
            <li>
              <strong className="text-dagno-ink">Téléphone :</strong>{" "}
              <a
                href="tel:+22364707523"
                className="text-dagno-blue hover:underline"
              >
                +223 64 70 75 23
              </a>
            </li>
            <li>
              <strong className="text-dagno-ink">Email :</strong>{" "}
              <a
                href="mailto:oumardagnon94@gmail.com"
                className="text-dagno-blue hover:underline"
              >
                oumardagnon94@gmail.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            Hébergement
          </h2>
          <p className="mt-3">
            Le site est hébergé sur une infrastructure cloud. Les coordonnées
            de l'hébergeur seront mises à jour lors de la mise en ligne
            définitive.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            L'ensemble des contenus du site (textes, images, logos, structure)
            est la propriété de DAGNO ELECTRONIQUE, sauf mention contraire. Toute
            reproduction sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            Responsabilité
          </h2>
          <p className="mt-3">
            DAGNO ELECTRONIQUE s'efforce de fournir des informations exactes sur
            les produits, les prix et les services proposés. Toutefois, des
            erreurs peuvent survenir. En cas de doute, contactez-nous avant de
            passer commande.
          </p>
          <p className="mt-3">
            Les prix affichés sont en francs CFA (FCFA) et peuvent être
            modifiés sans préavis. Le paiement s'effectue à la livraison.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            Droit applicable
          </h2>
          <p className="mt-3">
            Le présent site est soumis au droit malien. En cas de litige, les
            tribunaux compétents de Bamako seront seuls saisis.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-dagno-border">
        <Link to="/" className="text-sm text-dagno-blue hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}