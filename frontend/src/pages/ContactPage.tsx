export function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl md:text-3xl text-dagno-ink">
        Contact
      </h1>
      <p className="mt-1 text-sm text-dagno-inkSoft">
        Passez nous voir en boutique ou appelez-nous.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
          <p className="font-display font-semibold">Adresse</p>
          <p className="mt-2 text-sm text-dagno-inkSoft">
            Dravela-Bolibana
            <br />
            Bamako, Mali
          </p>
        </div>
        <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
          <p className="font-display font-semibold">Téléphone</p>
          <p className="mt-2 text-sm text-dagno-inkSoft">
            <a href="tel:+22394432539" className="hover:text-dagno-ink">
              +223 94 43 25 39
            </a>
            <br />
            <a href="tel:+22364707523" className="hover:text-dagno-ink">
              +223 64 70 75 23
            </a>
          </p>
        </div>
        <div className="bg-white border border-dagno-border rounded-md shadow-card p-5">
          <p className="font-display font-semibold">Horaires</p>
          <ul className="mt-2 text-sm text-dagno-inkSoft space-y-1">
            <li>Lundi – Vendredi : 8h – 20h</li>
            <li>Samedi : 9h – 20h</li>
            <li>Dimanche : fermé</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white border border-dagno-border rounded-md shadow-card p-5">
        <p className="font-display font-semibold">Nous trouver</p>
        <p className="mt-2 text-sm text-dagno-inkSoft">
          La boutique se trouve après le 2 ème Arrondissement.
        </p>
        <div className="mt-4 aspect-video bg-dagno-bg rounded border border-dagno-border grid place-items-center text-sm text-dagno-inkSoft">
          Carte à intégrer (Google Maps ou autre)
        </div>
      </div>
    </div>
  );
}