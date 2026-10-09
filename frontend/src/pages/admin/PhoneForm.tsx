import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import type { Brand, Phone } from "../../types";

interface Props {
  phone?: Phone;
  brands: Brand[];
  onSaved: () => void;
  onCancel: () => void;
}

export function PhoneForm({ phone, brands, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    brandId: phone?.brandId ?? brands[0]?.id ?? "",
    model: phone?.model ?? "",
    storage: phone?.storage ?? "",
    color: phone?.color ?? "",
    condition: phone?.condition ?? "NEW",
    price: phone?.price ?? 0,
    stock: phone?.stock ?? 0,
    description: phone?.description ?? "",
    warrantyMonths: phone?.warrantyMonths ?? 12,
  });
  const [imageUrl, setImageUrl] = useState(phone?.images[0] ?? "");
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        warrantyMonths: Number(form.warrantyMonths),
        images: imageUrl ? [imageUrl] : [],
      };

      if (phone) {
        await api.patch(`/admin/phones/${phone.id}`, payload);
      } else {
        await api.post("/admin/phones", payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
      <h2 className="font-display text-lg text-dagno-ink">
        {phone ? "Modifier le téléphone" : "Nouveau téléphone"}
      </h2>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dagno-ink">Marque</label>
          <select
            required
            value={form.brandId}
            onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Modèle"
          required
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />

        <Input
          label="Stockage"
          placeholder="ex. 128 Go"
          value={form.storage}
          onChange={(e) => setForm({ ...form, storage: e.target.value })}
        />

        <Input
          label="Couleur"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dagno-ink">État</label>
          <select
            value={form.condition}
            onChange={(e) =>
              setForm({ ...form, condition: e.target.value as any })
            }
            className="h-10 px-3 rounded border border-dagno-border bg-white text-sm focus:border-dagno-blue focus:outline-none"
          >
            <option value="NEW">Neuf</option>
            <option value="REFURBISHED">Reconditionné</option>
          </select>
        </div>

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

        <Input
          label="Garantie (mois)"
          type="number"
          value={form.warrantyMonths}
          onChange={(e) =>
            setForm({ ...form, warrantyMonths: Number(e.target.value) })
          }
        />

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-dagno-ink">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                src={`${import.meta.env.VITE_UPLOADS_URL}${imageUrl}`}
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