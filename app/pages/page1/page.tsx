"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { useRouter } from "next/navigation"; // Utilisez `useRouter` pour la redirection côté client
import { getSession } from "@/utils/sessions"; // Vérifiez la session utilisateur

export default function Page1() {
  const proposition = async () =>  {
    Crisp.message.show("field", {
      id: "proposition",
      text: "Quelle oeuvre voulez vous proposer ?",
      explain: "Le caca pourri...",
    });
  }
  Crisp.message.onMessageReceived(
    (data: { content: { id: string; value: any } }) => {
      if (data.content.id == "proposition") {
        const proposition = data.content.value;
        if (proposition) { // Si ce n'est pas vide
          saveProposition(proposition);
          Crisp.message.offMessageReceived();
          return;
        }
        return;
      }
    }
  );
  const saveProposition = async (proposition1 :string) => {
    try {
      // Récupérer la session utilisateur
      const session1 = await getSession();
      const client_id1 = session1.rowid;

      // Créer l'objet à envoyer au backend
      const visit = {
          rowid: client_id1,
          proposition: proposition1
      };

      // Envoyer la requête POST pour enregistrer la visite
      const response = await fetch('/api/proposition', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(visit),
      });
      console.log(response)
      if (response.ok) {
          console.log('Proposition envoyée !');
          Crisp.message.show("text","Vous avez bien envoyé votre proposition !");
      } else {
          console.error('Erreur lors du vote.');
          Crisp.message.show("text","Vous avez déja envoyé une proposition. ");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session ou de l\'envoi de la requête:', error);
        Crisp.message.show("text","Echec de l'envoi de la proposition. ");

  }
}




  const router = useRouter();

  useEffect(() => {
    // Vérification de la session utilisateur au chargement de la page
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        router.push("/login");
      } else {
        // Charger le SDK Crisp si l'utilisateur est authentifié
        await userLogin(session); // Passez la session à userLogin
      }
    };

    checkSession();
  }, []);

  const userLogin = async (session:string) => {
    // Configuration de Crisp
    Crisp.configure(process.env.NEXT_PUBLIC_WEBSITE_ID || "", {
      autoload: false,
    });

    // Utilisez les données de session pour définir le token
    Crisp.setTokenId(session.token); // Supposons que votre session ait un token

    // Charger le bot Crisp
    Crisp.load();
    Crisp.chat.open();
  };

  const userLogout = () => {
    // Réinitialisation de la session Crisp
    Crisp.session.reset();
    // Suppression du token Crisp pour arrêter le bot
    Crisp.setTokenId();

    // Logique de déconnexion supplémentaire si nécessaire
    // Par exemple, redirection vers la page d'accueil ou de connexion
    router.push("/login"); // Rediriger vers la page de connexion
  };

  const showCarousel = () => {
    const list = [
      {
        title: "La Nuit Etoilée",
        description: "Un ciel nocturne tourbillonnant",
        actions: [
          {
            label: "S'y rendre !",
            url: "/pages/Page_O1",
          },
        ],
      },
      {
        title: "Le Cri d'Edvard Munch",
        description: "Cris, angoisse, paysage tourbillonnant, désespoir.",
        actions: [
          {
            label: "S'y rendre !",
            url: "/pages/page_O2",
          },
        ],
      },
    ];

    Crisp.message.show("carousel", {
      text: "Voici la liste des oeuvres :",
      targets: list,
    });
  };

  return (
    <div>
      <h1>Page 1</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex tempore est
        vitae praesentium doloremque impedit, atque magni expedita quod ut
        autem, alias, ducimus deleniti aut. Reprehenderit rem iure iusto
        provident.
      </p>
      <button onClick={showCarousel}>Afficher le carousel</button>
      <button onClick={userLogout}>Déconnexion</button> {/* Ajout du bouton de déconnexion */}
      <button onClick={proposition}>Proposer une oeuvre</button>
    </div>
  );
}
