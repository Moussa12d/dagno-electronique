import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/telephones", label: "Téléphones" },
  { to: "/accessoires", label: "Accessoires" },
  { to: "/reparation", label: "Réparation" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-dagno-border shadow-header">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span
            aria-hidden
            className="w-8 h-8 rounded bg-dagno-blue text-white grid place-items-center font-display font-bold"
          >
            D
          </span>
          <span className="font-display font-semibold text-dagno-ink tracking-tight hidden sm:inline">
            DAGNO <span className="text-dagno-blue">ELECTRONIQUE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded transition-colors",
                  isActive
                    ? "text-dagno-blue bg-dagno-blueLight"
                    : "text-dagno-inkSoft hover:text-dagno-ink hover:bg-dagno-ink/5"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to={user.role === "ADMIN" ? "/admin" : "/mon-compte"}
              className="hidden sm:inline-block text-sm font-medium text-dagno-inkSoft hover:text-dagno-ink"
            >
              {user.firstName}
            </Link>
          ) : (
            <Link
              to="/connexion"
              className="hidden sm:inline-block text-sm font-medium text-dagno-inkSoft hover:text-dagno-ink"
            >
              Connexion
            </Link>
          )}

          <Link
            to="/panier"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded border border-dagno-border hover:border-dagno-blue transition-colors"
            aria-label="Panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-dagno-ink"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-dagno-blue text-white text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-dagno-border"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-dagno-ink"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-dagno-border bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium rounded transition-colors",
                    isActive
                      ? "text-dagno-blue bg-dagno-blueLight"
                      : "text-dagno-inkSoft hover:bg-dagno-ink/5"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="border-t border-dagno-border mt-2 pt-2">
              {user ? (
                <Link
                  to={user.role === "ADMIN" ? "/admin" : "/mon-compte"}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-dagno-inkSoft"
                >
                  Mon compte ({user.firstName})
                </Link>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-dagno-inkSoft"
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}