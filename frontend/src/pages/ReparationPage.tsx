import { useState } from "react";
import { api } from "../api/client";
import { useRepairTypes } from "../api/hooks";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { formatFCFA } from "../utils/format";

export function ReparationPage() {
  const { data: types, isLoading } = useRepairTypes();
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    phoneModel: "",
    repairTypeId: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<{ ticketNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [trackNumber, setTrackNumber] = useState("");
  const [tracking, setTracking] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post("/repairs/tickets", form);
      setTicket(data.data);
      setForm({
        clientName: "",
        clientPhone: "",
        phoneModel: "",
        repairTypeId: "",
        description: "",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error ?? "Erreur lors de l'envoi de la demande."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onTrack(e: React.FormEvent) {
    e.preventDefault();
    setTrackError(null);
    setTracking(null);

    // Vérification : le champ ne doit pas être vide
    const cleanNumber = trackNumber.trim();
    if (!cleanNumber) {
      setTrackError("Veuillez saisir un numéro de ticket.");
      return;
    }

    try {
      const { data } = await api.get(`/repairs/tickets/${cleanNumber}`);
      setTracking(data.data);
    } catch (err: any) {
      setTrackError(
        err.response?.data?.error ?? "Ticket introuvable. Vérifiez le numéro."
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="border-b border-dagno-border pb-10 max-w-3xl">
        <p className="text-xs uppercase tracking-wide text-dagno-inkSoft">
          Service réparation
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-dagno-ink">
          Réparation rapide,
          <br />
          <span className="text-dagno-blue">devis après examen.</span>
        </h1>
        <p className="mt-5 text-dagno-inkSoft leading-relaxed">
          Le diagnostic se fait <strong className="text-dagno-ink">uniquement en boutique</strong>.
          Vous recevez votre numéro de ticket, puis le prix exact vous est
          communiqué après examen de votre téléphone. Aucun frais si vous
          refusez le devis.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border-l-2 border-dagno-blue pl-4">
            <p className="text-xs text-dagno-inkSoft">01</p>
            <p className="mt-1 font-medium text-dagno-ink">
              Apportez le téléphone
            </p>
          </div>
          <div className="border-l-2 border-dagno-blue pl-4">
            <p className="text-xs text-dagno-inkSoft">02</p>
            <p className="mt-1 font-medium text-dagno-ink">
              Examen en boutique
            </p>
          </div>
          <div className="border-l-2 border-dagno-blue pl-4">
            <p className="text-xs text-dagno-inkSoft">03</p>
            <p className="mt-1 font-medium text-dagno-ink">
              Devis, réparation, garantie
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_400px]">
        <section>
          <h2 className="font-display text-2xl mb-5">
            Types d'intervention
          </h2>
          <p className="text-sm text-dagno-inkSoft mb-5">
            Le prix est communiqué après examen. Les délais dépendent de la
            disponibilité des pièces.
          </p>
          {isLoading && (
            <p className="text-sm text-dagno-inkSoft">Chargement...</p>
          )}
          {types && (
            <div className="border border-dagno-border rounded-md overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Intervention</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t) => (
                    <tr key={t.id} className="border-t border-dagno-border">
                      <td className="px-5 py-4">
                        <p className="font-medium text-dagno-ink">{t.name}</p>
                        {t.description && (
                          <p className="text-xs text-dagno-inkSoft mt-1">
                            {t.description}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="bg-white border border-dagno-border rounded-md shadow-card p-6">
            <h2 className="font-display text-xl">Demande de devis</h2>
            <p className="mt-1 text-xs text-dagno-inkSoft">
              Vous recevrez un numéro de ticket pour suivre l'avancement.
            </p>

            {ticket ? (
              <div className="mt-5 p-5 rounded border border-dagno-success/30 bg-green-50">
                <p className="text-sm text-dagno-ink">
                  Demande enregistrée. Conservez ce numéro :
                </p>
                <p className="mt-3 font-display font-bold text-dagno-success text-xl">
                  {ticket.ticketNumber}
                </p>
                <p className="mt-3 text-xs text-dagno-inkSoft">
                  Passez en boutique avec votre téléphone. Le prix vous sera
                  communiqué après examen.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 space-y-3">
                <Input
                  label="Nom complet"
                  name="clientName"
                  required
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                />
                <Input
                  label="Téléphone"
                  name="clientPhone"
                  required
                  placeholder="+223 ..."
                  value={form.clientPhone}
                  onChange={(e) =>
                    setForm({ ...form, clientPhone: e.target.value })
                  }
                />
                <Input
                  label="Modèle du téléphone"
                  name="phoneModel"
                  required
                  placeholder="ex. iPhone 12, Galaxy A15"
                  value={form.phoneModel}
                  onChange={(e) =>
                    setForm({ ...form, phoneModel: e.target.value })
                  }
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-dagno-ink">
                    Type de panne
                  </label>
                  <select
                    required
                    value={form.repairTypeId}
                    onChange={(e) =>
                      setForm({ ...form, repairTypeId: e.target.value })
                    }
                    className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
                  >
                    <option value="">Choisir...</option>
                    {types?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-dagno-ink">
                    Description (facultatif)
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="px-3 py-2 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
                  />
                </div>
                {error && <p className="text-xs text-dagno-danger">{error}</p>}
                <Button type="submit" loading={submitting} className="w-full">
                  Envoyer la demande
                </Button>
              </form>
            )}
          </div>

          <div className="bg-white border border-dagno-border rounded-md shadow-card p-6">
            <h2 className="font-display text-xl">Suivre une réparation</h2>
            <form onSubmit={onTrack} className="mt-5 space-y-3">
              <Input
                label="Numéro de ticket"
                name="trackNumber"
                placeholder="REP-2026-0001"
                required
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
              />
              <Button type="submit" variant="secondary" className="w-full">
                Vérifier le statut
              </Button>
            </form>

            {trackError && (
              <p className="mt-4 text-xs text-dagno-danger">{trackError}</p>
            )}

            {tracking && (
              <div className="mt-5 p-4 rounded border border-dagno-border bg-dagno-bg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-dagno-inkSoft">
                    {tracking.ticketNumber}
                  </span>
                  <Badge tone={tracking.status === "DONE" ? "green" : "orange"}>
                    {statusLabel(tracking.status)}
                  </Badge>
                </div>
                <p className="font-display text-lg text-dagno-ink">
                  {tracking.phoneModel}
                </p>
                <p className="text-xs text-dagno-inkSoft mt-1">
                  {tracking.repairType?.name}
                </p>
                {tracking.quotedPrice != null && (
                  <div className="mt-4 pt-4 border-t border-dagno-border flex justify-between">
                    <span className="text-xs text-dagno-inkSoft">
                      Prix devisé
                    </span>
                    <span className="font-display font-semibold text-dagno-ink">
                      {formatFCFA(tracking.quotedPrice)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function statusLabel(s: string): string {
  switch (s) {
    case "PENDING":
      return "En attente";
    case "DIAGNOSING":
      return "Diagnostic en cours";
    case "IN_PROGRESS":
      return "Réparation en cours";
    case "DONE":
      return "Terminée, à retirer";
    case "CANCELLED":
      return "Annulée";
    default:
      return s;
  }
}