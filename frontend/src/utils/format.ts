export function formatFCFA(amount: number): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\u202f|\u00a0/g, " ") + " FCFA"
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}