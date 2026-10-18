import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatFCFA } from "../../utils/format";
import { PhoneForm } from "./PhoneForm";
import type { Brand, Phone } from "../../types";

async function fetchPhones(): Promise<Phone[]> {
  const { data } = await api.get("/admin/phones", { params: { limit: 100 } });
  return data.data;
}

async function fetchBrands(): Promise<Brand[]> {
  const { data } = await api.get("/brands");
  return data.data;
}

export function AdminPhonesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Phone | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: phones, isLoading } = useQuery({
    queryKey: ["admin-phones"],
    queryFn: fetchPhones,
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  async function onDelete(phone: Phone) {
    if (!confirm(`Supprimer ${phone.model} ? Cette action est définitive.`))
      return;
    await api.delete(`/admin/phones/${phone.id}`);
    qc.invalidateQueries({ queryKey: ["admin-phones"] });
  }

  function onSaved() {
    setEditing(null);
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin-phones"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-dagno-ink">Téléphones</h1>
          <p className="mt-1 text-sm text-dagno-inkSoft">
            Gérez le catalogue des téléphones.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>Nouveau téléphone</Button>
      </div>

      {(creating || editing) && (
        <div className="mt-6">
          <PhoneForm
            phone={editing ?? undefined}
            brands={brands ?? []}
            onSaved={onSaved}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        </div>
      )}

      {isLoading && (
        <p className="mt-8 text-sm text-dagno-inkSoft">Chargement...</p>
      )}

      {phones && (
        <div className="mt-8 border border-dagno-border rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Modèle</th>
                <th className="px-4 py-2 font-medium">État</th>
                <th className="px-4 py-2 font-medium text-right">Prix</th>
                <th className="px-4 py-2 font-medium text-right">Stock</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phones.map((p) => (
                <tr key={p.id} className="border-t border-dagno-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dagno-ink">
                      {p.brand.name} {p.model}
                    </p>
                    <p className="text-xs text-dagno-inkSoft">
                      {p.storage} · {p.color}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={p.condition === "NEW" ? "blue" : "orange"}>
                      {p.condition === "NEW" ? "Neuf" : "Arrivage"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatFCFA(p.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.stock === 0 ? (
                      <span className="text-dagno-danger">{p.stock}</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-dagno-blue hover:underline text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="text-dagno-danger hover:underline text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {phones.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-dagno-inkSoft"
                  >
                    Aucun téléphone. Cliquez sur "Nouveau téléphone".
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