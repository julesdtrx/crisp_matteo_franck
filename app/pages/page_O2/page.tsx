"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Crisp } from "crisp-sdk-web";
import { getSession } from "@/utils/sessions";
export default function Page1(){
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
    
      const userLogin = async (session) => {
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
    const vote1 = async () =>{
        try {
            // Récupérer la session utilisateur
            const session1 = await getSession();
            const client_id1 = session1.rowid;

            // Créer l'objet à envoyer au backend
            const visit = {
                rowid: client_id1,
                oeuvre: "Le Cri d'Edvard Munch"
            };

            // Envoyer la requête POST pour enregistrer la visite
            const response = await fetch('/api/vote2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visit),
            });
            console.log(response)
            if (response.ok) {
                console.log('Vote avec succes');
                Crisp.message.show("text","Vous avez bien voté !");
            } else {
                console.error('Erreur lors du vote.');
                Crisp.message.show("text","Vous avez déja voté :/ ");
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la session ou de l\'envoi de la requête:', error);
        }
    }
    const registerVisit = async () => {
        try {
            // Récupérer la session utilisateur
            const session = await getSession();
            const client_id = session.rowid;

            // Créer l'objet à envoyer au backend
            const visit = {
                rowid: client_id,
                oeuvre: "le cri d'Edvard Munch"
            };

            // Envoyer la requête POST pour enregistrer la visite
            const response = await fetch('/api/visite2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visit),
            });
            console.log(response)
            if (response.ok) {
                console.log('Visite enregistrée avec succès.');
            } else {
                console.error('Erreur lors de l\'enregistrement de la visite.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la session ou de l\'envoi de la requête:', error);
        }
    };

    // Utiliser useEffect pour déclencher l'enregistrement lors du chargement de la page
    useEffect(() => {
        registerVisit();
    }, []);
    return (
        <>
            <h1>Le Cri d’Edvard Munch</h1>
            <p>
            Cette œuvre représente une figure au visage tordu, poussant un cri agonisant sur un pont, surplombant un paysage flamboyant. Elle est souvent interprétée comme une représentation de l'angoisse existentielle.
            </p>

            <img src="/lecri.jpg" alt="Le Cri d'Edvard Munch" width="auto"/>
            <button onClick={vote1}>Voter pour cette œuvre</button>

        </>
    );



}
