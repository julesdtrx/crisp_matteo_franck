"use server";
 
import { checkPassword } from "@/utils/bcryptjs";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { createCookie } from "@/utils/sessions";
 
export async function POST(req: Request) {
    // Get body request
    const body = await req.json();
    const { rowid, oeuvre } = body;
   
    // Call login function (see below)
    const response = await verif_vote(rowid, oeuvre);
   
    // If response is false
    if (response == false) {
      // Return an appropriate error message
      return NextResponse.json(
        { message: "Vous avez déja effectué un vote" },
        { status: 560 }
      );
    }
    return NextResponse.json({ response });
  }
   
  async function verif_vote(rowid: string, oeuvre: string) {
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
    const verif = `SELECT rowid FROM vote WHERE user_id = ?`;
    const userVerif = await db.get(verif, rowid);
   
    if (userVerif) {
      return false;
    }
    const sql = `INSERT INTO vote (user_id, oeuvre_vote) VALUES (?, ?)`;
    const insert = await db.get(sql, rowid, oeuvre);
 

    return insert;
  }