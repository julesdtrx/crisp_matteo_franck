"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./utils/sessions";

export async function middleware(request: NextRequest) {
  const { status } = await checkAuth(); // Vérifiez l'authentification de l'utilisateur

  // Définissez les routes protégées
  const protectedRoutes = ['/mon-compte', '/pages'];

  // Si la route demandée est protégée et que l'utilisateur n'est pas autorisé
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url)); // Rediriger vers la page de connexion
  }

  return NextResponse.next(); // Continuez si l'utilisateur est autorisé
}
