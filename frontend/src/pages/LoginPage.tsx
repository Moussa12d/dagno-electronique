import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(identifier, password);
      if (redirect) {
        navigate(redirect);
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ??
          "Téléphone/email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-display text-2xl text-dagno-ink">Connexion</h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Accédez à votre compte DAGNO ELECTRONIQUE.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input
          label="Téléphone ou email"
          name="identifier"
          type="text"
          required
          autoComplete="username"
          placeholder="+223 70 00 00 00"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-dagno-danger">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-sm text-dagno-inkSoft">
        Pas encore de compte ?{" "}
        <Link to="/inscription" className="text-dagno-blue hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}