import { useState } from "react";
import { api } from "../api/client";
import { useRepairTypes } from "../api/hooks";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
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
    try {
      const { data } = await api.get(`/repairs/tickets/${trackNumber.trim()}`);
      setTracking(data.data);
    } catch (err: any) {
      setTrackError(
        err.response?.data?.error ?? "Ticket introuvable. Vérifiez le numéro."
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl md:text-3xl text-dagno-ink">
        Réparation
      </h1>
      <p className="mt-1 text-sm text-dagno-inkSoft max-w-2xl">
        Diagnostic gratuit en boutique. Devis confirmé avant intervention.
        Aucun frais si vous refusez le devis.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_400px]">
        <section>
          <h2 className="font-display text-lg mb-3">Types de réparation</h2>
          {isLoading && (
            <p className="text-sm text-dagno-inkSoft">Chargement...</p>
          )}
          {types && (
            <div className="border border-dagno-border rounded-md overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Intervention</th>
                    <th className="px-4 py-2 font-medium">Délai</th>
                    <th className="px-4 py-2 font-medium text-right">
                      À partir de
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t) => (
                    <tr key={t.id} className="border-t border-dagno-border">
                      <td className="px-4 py-3">
                        <p className="font-medium text-dagno-ink">{t.name}</p>
                        {t.description && (
                          <p className="text-xs text-dagno-inkSoft mt-0.5">
                            {t.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-dagno-inkSoft">
                        {t.estimatedDuration ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-display font-semibold">
                        {formatFCFA(t.basePrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-8">
          <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
            <h2 className="font-display text-lg">Demande de devis</h2>
            {ticket ? (
              <div className="mt-4 p-4 rounded border border-dagno-success/30 bg-green-50">
                <p className="text-sm text-dagno-ink">
                  Demande enregistrée. Conservez ce numéro :
                </p>
                <p className="mt-2 font-display font-bold text-dagno-success text-lg">
                  {ticket.ticketNumber}
                </p>
                <p className="mt-2 text-xs text-dagno-inkSoft">
                  Vous pouvez suivre l'avancement ci-dessous avec ce numéro.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-4 space-y-3">
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
                        {t.name} — à partir de {formatFCFA(t.basePrice)}
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
                {error && (
                  <p className="text-xs text-dagno-danger">{error}</p>
                )}
                <Button type="submit" loading={submitting} className="w-full">
                  Envoyer la demande
                </Button>
              </form>
            )}
          </div>

          <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
            <h2 className="font-display text-lg">Suivi de réparation</h2>
            <form onSubmit={onTrack} className="mt-4 space-y-3">
              <Input
                label="Numéro de ticket"
                name="trackNumber"
                placeholder="REP-2026-0001"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
              >
                Vérifier le statut
              </Button>
            </form>

            {trackError && (
              <p className="mt-3 text-xs text-dagno-danger">{trackError}</p>
            )}

            {tracking && (
              <div className="mt-4 p-3 rounded border border-dagno-border bg-dagno-bg text-sm">
                <p className="font-medium text-dagno-ink">
                  {tracking.phoneModel}
                </p>
                <p className="text-xs text-dagno-inkSoft mt-1">
                  {tracking.repairType?.name}
                </p>
                <p className="mt-3 text-xs text-dagno-inkSoft">Statut</p>
                <p className="font-display font-semibold text-dagno-ink">
                  {statusLabel(tracking.status)}
                </p>
                {tracking.quotedPrice != null && (
                  <>
                    <p className="mt-3 text-xs text-dagno-inkSoft">
                      Prix devisé
                    </p>
                    <p className="font-display font-semibold text-dagno-ink">
                      {formatFCFA(tracking.quotedPrice)}
                    </p>
                  </>
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
      return "En attente de diagnostic";
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