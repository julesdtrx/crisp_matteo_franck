"use server";
 
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
 
// Create sleep function
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
 
export async function getUsers() {
  // Sleep for 2 seconds
  await sleep(2000);
 
  let db = null;
 
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: process.env.DATABASE_NAME || "", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }
 
  // Get all users
  const sql = `SELECT rowid, name, email, pwd FROM users`;
  const users = await db.all(sql);
 
  return NextResponse.json(users);
}