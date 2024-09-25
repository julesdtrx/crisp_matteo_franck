"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Créer le JWT
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + 180 * 1000) // JWT expiration (3 minutes)
    .sign(key);
}

// Lire le JWT
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Créer le cookie
export async function createCookie(sessionData: object) {
  const encryptedSessionData = await encrypt(sessionData);

  cookies().set("session", encryptedSessionData, {
    httpOnly: true,
    secure: false, // Changez à true en production
    path: "/",
  });
}

// Détruire le cookie
export async function logout() {
  // Détruire la session
  cookies().set("session", "", { expires: new Date(0) });
}

// Lire le cookie
export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// Vérifier l'authentification
export async function checkAuth() {
  const session = await getSession();

  if (!session) { // Si aucune session n'est définie
    return { status: 403, message: "User is not authenticated" }; // Pour middleware
  }

  if (session.exp < Date.now()) { // Si le JWT est expiré
    return { status: 403, message: "Session expired" }; // Pour middleware
  }

  return { status: 200, message: "Logged" }; // Utilisateur authentifié
}

// Authentifier l'utilisateur
export async function authenticateUser(name: string, pwd: string) {
  // Remplacez cette logique par la récupération de l'utilisateur à partir de votre base de données
  const user = await getUserByCredentials(name, pwd); // Fonction fictive

  // Ajoutez votre logique pour vérifier si l'utilisateur existe
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Si l'utilisateur existe, vous pouvez effectuer d'autres actions, comme générer un JWT
  return user; // ou tout autre objet que vous souhaitez retourner
}

// Exemple de fonction fictive pour récupérer un utilisateur
async function getUserByCredentials(name: string, pwd: string) {
  // Remplacez cela par la logique d'accès à la base de données
  // Ceci est juste un exemple, vous devez interroger votre base de données
  const mockUser = { username: "testUser", password: "testPassword", rowid: 1 };

  // Vérification simple (remplacez cela par une vérification sécurisée dans votre base de données)
  if (name === mockUser.username && pwd === mockUser.password) {
    return mockUser;
  }
  
  return null; // Si l'utilisateur n'est pas trouvé
}
