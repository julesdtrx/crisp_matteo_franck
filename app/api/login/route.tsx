"use server";
 
import { checkPassword } from "@/utils/bcryptjs";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { createCookie } from "@/utils/sessions";
 
export async function POST(req: Request) {
  // Get body request
  const body = await req.json();
  const { email, password } = body;
 
  // Call login function (see below)
  const response = await login(email, password);
 
  // If response is false
  if (response == false) {
    // Return an appropriate error message
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 403 }
    );
  }
  const sessionData = { rowid: response, email: email }; // Data to add in the JWT payload such as user id, role, etc
  await createCookie(sessionData);
 
  return NextResponse.json({ response });
}
 
async function login(email: string, password: string) {
  let db = null;
 
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: process.env.DATABASE_NAME || "", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }
 
  // Check if a user exist with this email
  const verif = `SELECT rowid, email, pwd FROM users WHERE email = ?`;
  const userVerif = await db.get(verif, email);
 
  if (!userVerif) {
    return false;
  }
 
  // Check if password is correct
  const checkPwd = await checkPassword(password, userVerif.pwd);
 
  if (!checkPwd) {
    return false;
  }
 
  return userVerif.rowid;
}