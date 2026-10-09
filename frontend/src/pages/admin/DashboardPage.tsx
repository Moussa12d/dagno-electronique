import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { formatFCFA } from "../../utils/format";

interface Stats {
  totalPhones: number;
  outOfStockPhones: number;
  totalAccessories: number;
  outOfStockAccessories: number;
  pendingRepairs: number;
  inProgressRepairs: number;
  pendingOrders: number;
  totalStockValue: number;
}

async function fetchStats(): Promise<Stats> {
  const [phones, accessories, repairs, orders] = await Promise.all([
    api.get("/admin/phones", { params: { limit: 1000 } }),
    api.get("/admin/accessories", { params: { limit: 1000 } }),
    api.get("/admin/repairs/tickets", { params: { limit: 1000 } }),
    api.get("/admin/orders", { params: { limit: 1000 } }),
  ]);

  const phoneList = phones.data.data;
  const accessoryList = accessories.data.data;
  const repairList = repairs.data.data;
  const orderList = orders.data.data;

  const totalStockValue =
    phoneList.reduce((sum: number, p: any) => sum + p.price * p.stock, 0) +
    accessoryList.reduce((sum: number, a: any) => sum + a.price * a.stock, 0);

  return {
    totalPhones: phoneList.length,
    outOfStockPhones: phoneList.filter((p: any) => p.stock === 0).length,
    totalAccessories: accessoryList.length,
    outOfStockAccessories: accessoryList.filter((a: any) => a.stock === 0).length,
    pendingRepairs: repairList.filter((r: any) => r.status === "PENDING").length,
    inProgressRepairs: repairList.filter((r: any) =>
      ["DIAGNOSING", "IN_PROGRESS"].includes(r.status)
    ).length,
    pendingOrders: orderList.filter((o: any) => o.status === "PENDING").length,
    totalStockValue,
  };
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return <p className="text-sm text-dagno-inkSoft">Chargement...</p>;
  }
  if (isError || !data) {
    return (
      <p className="text-sm text-dagno-danger">
        Impossible de charger les statistiques.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-dagno-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Vue d'ensemble de la boutique DAGNO ELECTRONIQUE.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Téléphones en catalogue"
          value={String(data.totalPhones)}
          hint={
            data.outOfStockPhones > 0
              ? `${data.outOfStockPhones} en rupture`
              : "Tous en stock"
          }
          link="/admin/telephones"
        />
        <StatCard
          label="Accessoires en catalogue"
          value={String(data.totalAccessories)}
          hint={
            data.outOfStockAccessories > 0
              ? `${data.outOfStockAccessories} en rupture`
              : "Tous en stock"
          }
          link="/admin/accessoires"
        />
        <StatCard
          label="Valeur du stock"
          value={formatFCFA(data.totalStockValue)}
          hint="Téléphones + accessoires"
        />
        <StatCard
          label="Réparations en attente"
          value={String(data.pendingRepairs)}
          hint="À diagnostiquer"
          link="/admin/reparations"
        />
        <StatCard
          label="Réparations en cours"
          value={String(data.inProgressRepairs)}
          hint="Diagnostic ou intervention"
          link="/admin/reparations"
        />
        <StatCard
          label="Commandes en attente"
          value={String(data.pendingOrders)}
          hint="À confirmer"
          link="/admin/commandes"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  link,
}: {
  label: string;
  value: string;
  hint?: string;
  link?: string;
}) {
  const content = (
    <div className="bg-white border border-dagno-border rounded-md shadow-card p-5 hover:border-dagno-blue/40 transition-colors h-full">
      <p className="text-sm text-dagno-inkSoft">{label}</p>
      <p className="mt-2 font-display text-2xl text-dagno-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-dagno-inkSoft">{hint}</p>}
    </div>
  );

  if (link) return <Link to={link}>{content}</Link>;
  return content;
}