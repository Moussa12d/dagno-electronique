import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";

const items = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/telephones", label: "Téléphones" },
  { to: "/admin/accessoires", label: "Accessoires" },
  { to: "/admin/reparations", label: "Réparations" },
  { to: "/admin/commandes", label: "Commandes" },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dagno-bg">
      <header className="bg-white border-b border-dagno-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-dagno-blue text-white grid place-items-center font-display font-bold">
                D
              </span>
              <span className="font-display font-semibold text-dagno-ink">
                DAGNO <span className="text-dagno-blue">ADMIN</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dagno-inkSoft hidden sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
            <Link
              to="/"
              className="text-sm text-dagno-inkSoft hover:text-dagno-ink"
            >
              Voir le site
            </Link>
            <Button variant="secondary" size="sm" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium rounded whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-dagno-blueLight text-dagno-blueDark"
                      : "text-dagno-inkSoft hover:bg-dagno-ink/5 hover:text-dagno-ink"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}