import sqlite3 from "sqlite3";
import { open } from "sqlite";

const path = "./mydb.sqlite";
async function openDb() {
  return open({
    filename: path, // Path to your SQLite database file
    driver: sqlite3.Database,
  });
}

export default openDb;
