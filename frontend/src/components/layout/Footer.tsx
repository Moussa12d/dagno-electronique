import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-dagno-border bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-display font-semibold text-dagno-ink">
            DAGNO ELECTRONIQUE
          </p>
          <p className="mt-2 text-sm text-dagno-inkSoft">
            Vente de téléphones, accessoires et réparation.
            <br />
            Dravela-Bolibana, Bamako, Mali.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-dagno-ink">Boutique</p>
          <ul className="mt-2 space-y-1 text-sm text-dagno-inkSoft">
            <li>
              <Link to="/telephones" className="hover:text-dagno-ink">
                Téléphones
              </Link>
            </li>
            <li>
              <Link to="/accessoires" className="hover:text-dagno-ink">
                Accessoires
              </Link>
            </li>
            <li>
              <Link to="/reparation" className="hover:text-dagno-ink">
                Réparation
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-dagno-ink">Contact</p>
          <ul className="mt-2 space-y-1 text-sm text-dagno-inkSoft">
            <li>Dravela-Bolibana</li>
            <li>Bamako, Mali</li>
            <li>
              <a href="tel:+22364707523" className="hover:text-dagno-ink">
                +223 64 70 75 23
              </a>
            </li>
            <li>
              <a
                href="mailto:oumardagnon94@gmail.com"
                className="hover:text-dagno-ink"
              >
                oumardagnon94@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-dagno-ink">Informations</p>
          <ul className="mt-2 space-y-1 text-sm text-dagno-inkSoft">
            <li>
              <Link to="/confidentialite" className="hover:text-dagno-ink">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/mentions-legales" className="hover:text-dagno-ink">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dagno-border">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-dagno-inkSoft flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © {new Date().getFullYear()} DAGNO ELECTRONIQUE. Tous droits
            réservés.
          </span>
          <span>Bamako, Mali</span>
        </div>
      </div>
    </footer>
  );
}