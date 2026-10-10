import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { formatFCFA } from "../../utils/format";
import { UPLOADS_URL } from "../../api/client";
import type { Accessory, AccessoryCategory } from "../../types";

async function fetchAccessories(): Promise<Accessory[]> {
  const { data } = await api.get("/admin/accessories", {
    params: { limit: 200 },
  });
  return data.data;
}

async function fetchCategories(): Promise<AccessoryCategory[]> {
  const { data } = await api.get("/accessories/categories");
  return data.data;
}

export function AdminAccessoriesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Accessory | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: accessories, isLoading } = useQuery({
    queryKey: ["admin-accessories"],
    queryFn: fetchAccessories,
  });

  const { data: categories } = useQuery({
    queryKey: ["accessory-categories"],
    queryFn: fetchCategories,
  });

  async function onDelete(a: Accessory) {
    if (!confirm(`Supprimer "${a.name}" ?`)) return;
    await api.delete(`/admin/accessories/${a.id}`);
    qc.invalidateQueries({ queryKey: ["admin-accessories"] });
  }

  function onSaved() {
    setEditing(null);
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin-accessories"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-dagno-ink">Accessoires</h1>
          <p className="mt-1 text-sm text-dagno-inkSoft">
            Gérez le catalogue d'accessoires.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>Nouvel accessoire</Button>
      </div>

      {(creating || editing) && (
        <AccessoryForm
          accessory={editing ?? undefined}
          categories={categories ?? []}
          onSaved={onSaved}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      {isLoading && (
        <p className="mt-8 text-sm text-dagno-inkSoft">Chargement...</p>
      )}

      {accessories && (
        <div className="mt-8 border border-dagno-border rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-dagno-bg text-dagno-inkSoft text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Image</th>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Catégorie</th>
                <th className="px-4 py-2 font-medium text-right">Prix</th>
                <th className="px-4 py-2 font-medium text-right">Stock</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((a) => (
                <tr key={a.id} className="border-t border-dagno-border">
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 rounded bg-dagno-bg border border-dagno-border grid place-items-center overflow-hidden">
                      {a.images[0] ? (
                        <img
                          src={`${UPLOADS_URL}${a.images[0]}`}
                          alt={a.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-dagno-inkSoft">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-dagno-ink">
                    {a.name}
                  </td>
                  <td className="px-4 py-3 text-dagno-inkSoft">
                    {a.category.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatFCFA(a.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.stock === 0 ? (
                      <span className="text-dagno-danger">{a.stock}</span>
                    ) : (
                      a.stock
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setEditing(a)}
                      className="text-dagno-blue hover:underline text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(a)}
                      className="text-dagno-danger hover:underline text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {accessories.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-dagno-inkSoft"
                  >
                    Aucun accessoire. Cliquez sur "Nouvel accessoire".
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

function AccessoryForm({
  accessory,
  categories,
  onSaved,
  onCancel,
}: {
  accessory?: Accessory;
  categories: AccessoryCategory[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    categoryId: accessory?.categoryId ?? categories[0]?.id ?? "",
    name: accessory?.name ?? "",
    description: accessory?.description ?? "",
    price: accessory?.price ?? 0,
    stock: accessory?.stock ?? 0,
  });
  const [imageUrl, setImageUrl] = useState(accessory?.images[0] ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/uploads", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(data.data.url);
    } catch {
      setError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: imageUrl ? [imageUrl] : [],
      };
      if (accessory) {
        await api.patch(`/admin/accessories/${accessory.id}`, payload);
      } else {
        await api.post("/admin/accessories", payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 bg-white border border-dagno-border rounded-md shadow-card p-5">
      <h2 className="font-display text-lg">
        {accessory ? "Modifier l'accessoire" : "Nouvel accessoire"}
      </h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Catégorie</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Nom"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Prix (FCFA)"
          type="number"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <Input
          label="Stock"
          type="number"
          required
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-dagno-ink">Image</label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
              className="text-sm"
            />
            {uploading && (
              <span className="text-xs text-dagno-inkSoft">Upload...</span>
            )}
            {imageUrl && (
              <img
                src={`${UPLOADS_URL}${imageUrl}`}
                alt=""
                className="w-12 h-12 object-cover rounded border border-dagno-border"
              />
            )}
          </div>
        </div>

        {error && (
          <p className="md:col-span-2 text-sm text-dagno-danger">{error}</p>
        )}
        <div className="md:col-span-2 flex gap-2">
          <Button type="submit" loading={saving}>
            Enregistrer
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}