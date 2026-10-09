import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RequireAdmin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-sm text-dagno-inkSoft">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion?redirect=/admin" replace />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-dagno-danger font-medium">
          Accès réservé à l'administrateur.
        </p>
        <p className="mt-2 text-sm text-dagno-inkSoft">
          Votre compte n'a pas les droits nécessaires.
        </p>
      </div>
    );
  }

  return <Outlet />;
}