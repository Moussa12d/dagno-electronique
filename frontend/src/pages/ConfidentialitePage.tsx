import { Link } from "react-router-dom";

export function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-xs uppercase tracking-wide text-dagno-inkSoft">
        Dernière mise à jour : 11 octobre 2026
      </p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-dagno-ink">
        Politique de confidentialité
      </h1>
      <p className="mt-3 text-dagno-inkSoft">
        Chez DAGNO ELECTRONIQUE, nous prenons la protection de vos données
        personnelles au sérieux. Cette page explique simplement quelles
        informations nous collectons, pourquoi, et comment vous pouvez les
        contrôler.
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-dagno-inkSoft">
        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            1. Qui sommes-nous ?
          </h2>
          <p className="mt-3">
            DAGNO ELECTRONIQUE est une boutique de vente de téléphones,
            accessoires et de réparation, située à Dravela-Bolibana, Bamako,
            Mali. Nous sommes responsables du traitement des données
            personnelles collectées sur ce site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            2. Quelles données collectons-nous ?
          </h2>
          <p className="mt-3">
            Nous ne collectons que les informations strictement nécessaires
            pour vous servir :
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-dagno-ink">Identité :</strong> nom et
              prénom
            </li>
            <li>
              <strong className="text-dagno-ink">Contact :</strong> numéro de
              téléphone, adresse email (optionnelle), adresse de livraison
            </li>
            <li>
              <strong className="text-dagno-ink">Historique :</strong> vos
              commandes passées et vos tickets de réparation
            </li>
            <li>
              <strong className="text-dagno-ink">
                Données techniques :
              </strong>{" "}
              adresse IP (uniquement pour la sécurité du site, contre les
              abus)
            </li>
          </ul>
          <p className="mt-3">
            Nous ne collectons <strong>jamais</strong> de données bancaires,
            car le paiement se fait à la livraison.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            3. Pourquoi collectons-nous ces données ?
          </h2>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Traiter vos commandes et organiser les livraisons</li>
            <li>Suivre vos réparations par ticket</li>
            <li>Vous contacter pour confirmer une commande ou une réparation</li>
            <li>Sécuriser le site contre les tentatives d'abus</li>
            <li>Respecter nos obligations légales et comptables</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            4. Combien de temps gardons-nous vos données ?
          </h2>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-dagno-ink">Compte client :</strong> tant
              que votre compte est actif. Vous pouvez demander sa suppression à
              tout moment.
            </li>
            <li>
              <strong className="text-dagno-ink">Commandes :</strong> 5 ans,
              pour respecter nos obligations comptables.
            </li>
            <li>
              <strong className="text-dagno-ink">
                Tickets de réparation :
              </strong>{" "}
              2 ans après la dernière intervention.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            5. Qui a accès à vos données ?
          </h2>
          <p className="mt-3">
            Vos données sont accessibles uniquement à l'équipe de DAGNO
            ELECTRONIQUE, dans le cadre strict de leur travail. Nous ne
            vendons, ni ne partageons, ni ne louons vos données à des tiers.
          </p>
          <p className="mt-3">
            La seule exception concerne les obligations légales : si une
            autorité compétente nous demande des informations, nous devrons y
            répondre.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            6. Vos droits
          </h2>
          <p className="mt-3">Vous pouvez à tout moment :</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Demander à voir les données que nous avons sur vous</li>
            <li>Faire corriger une information incorrecte</li>
            <li>Demander la suppression de votre compte et de vos données</li>
            <li>Vous opposer à ce que nous utilisions vos données</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous par WhatsApp ou par email
            (coordonnées ci-dessous). Nous répondrons sous 7 jours ouvrés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            7. Cookies et stockage local
          </h2>
          <p className="mt-3">
            Nous utilisons uniquement le stockage local de votre navigateur
            pour :
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Vous garder connecté à votre compte</li>
            <li>Mémoriser votre panier</li>
            <li>Mémoriser vos préférences d'affichage</li>
          </ul>
          <p className="mt-3">
            Nous n'utilisons <strong>aucun cookie publicitaire</strong>, ni
            aucun outil de suivi externe (Google Analytics, Facebook Pixel,
            etc.).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            8. Sécurité
          </h2>
          <p className="mt-3">
            Vos mots de passe sont chiffrés avant d'être stockés. Nous
            utilisons une connexion sécurisée (HTTPS) pour toutes les
            communications. Nous limitons les tentatives de connexion pour
            empêcher les accès non autorisés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            9. Modifications de cette politique
          </h2>
          <p className="mt-3">
            Cette politique peut être mise à jour pour refléter des changements
            dans nos pratiques ou la loi. La date de dernière mise à jour est
            indiquée en haut de cette page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-dagno-ink">
            10. Nous contacter
          </h2>
          <p className="mt-3">
            Pour toute question concernant vos données personnelles :
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong className="text-dagno-ink">WhatsApp :</strong>{" "}
              <a
                href="https://wa.me/22364707523"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dagno-blue hover:underline"
              >
                +223 64 70 75 23
              </a>
            </li>
            <li>
              <strong className="text-dagno-ink">Email :</strong>{" "}
              <a
                href="mailto:oumardagnon94@gmail.com"
                className="text-dagno-blue hover:underline"
              >
                oumardagnon94@gmail.com
              </a>
            </li>
            <li>
              <strong className="text-dagno-ink">Adresse :</strong>{" "}
              Dravela-Bolibana, Bamako, Mali
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-dagno-border">
        <Link to="/" className="text-sm text-dagno-blue hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}