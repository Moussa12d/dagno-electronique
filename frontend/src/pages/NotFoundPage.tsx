import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="font-display text-5xl text-dagno-ink">404</p>
      <p className="mt-3 text-dagno-inkSoft">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-10 px-4 items-center rounded bg-dagno-blue text-white text-sm font-medium hover:bg-dagno-blueDark transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}