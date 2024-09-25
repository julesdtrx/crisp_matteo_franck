"use server";
 
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
 
export async function POST(req: Request) {
  // Get body request
  const body = await req.json();
  const {rowid, oeuvre} = body;
 
  // Call register function (see below)
  const response = await oeuvre_visitee(rowid, oeuvre);

  return NextResponse.json({ response });
}
 
async function oeuvre_visitee(
  rowid: string,
  oeuvre: string,
) {
  let db = null;
 
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: process.env.DATABASE_name || "", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }
 
 console.log(rowid)
  // Insert the new user
  const sql = `INSERT INTO connexion (user_id, oeuvre) VALUES (?, ?)`;
  const insert = await db.get(sql, rowid, oeuvre);
 
  return insert;
}