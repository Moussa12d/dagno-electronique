import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../api/client";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatFCFA, formatDate } from "../../utils/format";

interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  clientPhone: string;
  phoneModel: string;
  status: string;
  quotedPrice: number | null;
  createdAt: string;
  repairType: { name: string };
}

async function fetchTickets(): Promise<Ticket[]> {
  const { data } = await api.get("/admin/repairs/tickets", {
    params: { limit: 200 },
  });
  return data.data;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  DIAGNOSING: "Diagnostic",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
};

const STATUS_TONES: Record<string, "gray" | "blue" | "orange" | "green" | "red"> = {
  PENDING: "gray",
  DIAGNOSING: "blue",
  IN_PROGRESS: "orange",
  DONE: "green",
  CANCELLED: "red",
};

export function AdminRepairsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Ticket | null>(null);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-repairs"],
    queryFn: fetchTickets,
  });

  function onSaved() {
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-repairs"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-dagno-ink">Réparations</h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Suivi des tickets et mise à jour du statut.
      </p>

      {editing && (
        <TicketEditor
          ticket={editing}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      {isLoading && (
        <p className="mt-8 text-sm text-dagno-inkSoft">Chargement...</p>
      )}

      {tickets && (
        <div className="mt-8 border border-dagno-border rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Ticket</th>
                <th className="px-4 py-2 font-medium">Client</th>
                <th className="px-4 py-2 font-medium">Panne</th>
                <th className="px-4 py-2 font-medium">Statut</th>
                <th className="px-4 py-2 font-medium text-right">Prix</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-dagno-border">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-medium">
                      {t.ticketNumber}
                    </p>
                    <p className="text-xs text-dagno-inkSoft">
                      {formatDate(t.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-dagno-ink">{t.clientName}</p>
                    <p className="text-xs text-dagno-inkSoft">{t.clientPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-dagno-ink">{t.phoneModel}</p>
                    <p className="text-xs text-dagno-inkSoft">
                      {t.repairType.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONES[t.status] ?? "gray"}>
                      {STATUS_LABELS[t.status] ?? t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.quotedPrice != null ? formatFCFA(t.quotedPrice) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(t)}
                      className="text-dagno-blue hover:underline text-xs"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-dagno-inkSoft"
                  >
                    Aucun ticket de réparation pour l'instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TicketEditor({
  ticket,
  onSaved,
  onCancel,
}: {
  ticket: Ticket;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState(ticket.status);
  const [quotedPrice, setQuotedPrice] = useState(ticket.quotedPrice ?? 0);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/admin/repairs/tickets/${ticket.id}`, {
        status,
        quotedPrice: quotedPrice > 0 ? Number(quotedPrice) : null,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 bg-white border border-dagno-border rounded-md shadow-card p-5">
      <h2 className="font-display text-lg">
        Ticket {ticket.ticketNumber}
      </h2>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        {ticket.clientName} · {ticket.phoneModel}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Prix devisé (FCFA)</label>
          <input
            type="number"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(Number(e.target.value))}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={save} loading={saving}>
          Enregistrer
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}