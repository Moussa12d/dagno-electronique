import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.phone.trim().length < 8) {
      setError("Numéro de téléphone invalide.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
      });
      // Connexion automatique avec l'email généré côté backend
      await login(data.data.user.email, form.password);
      navigate("/mon-compte");
    } catch (err: any) {
      setError(
        err.response?.data?.error ?? "Erreur lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-display text-2xl text-dagno-ink">Créer un compte</h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Suivez vos commandes et vos réparations en un seul endroit.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Prénom"
            name="firstName"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <Input
            label="Nom"
            name="lastName"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <Input
          label="Téléphone"
          name="phone"
          type="tel"
          required
          placeholder="+223 70 00 00 00"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Input
          label="Adresse (facultatif)"
          name="address"
          placeholder="Quartier, rue..."
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <Input
          label="Mot de passe"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Input
          label="Confirmer le mot de passe"
          name="confirm"
          type="password"
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        {error && <p className="text-sm text-dagno-danger">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-sm text-dagno-inkSoft">
        Déjà un compte ?{" "}
        <Link to="/connexion" className="text-dagno-blue hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}