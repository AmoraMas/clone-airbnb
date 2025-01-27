// Creates a new Pool connection to pg

import pg from "pg";
const { Pool } = pg;

// take in environmental variables for DB connection, or use default if not defined
// our local environment may not have them, but Render will when deployed
const POSTGRES_HOST = process.env.POSTGRES_HOST || "127.0.0.1";
const POSTGRES_DB = process.env.POSTGRES_DB || "housing";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
const POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
const DATABASE_URL = process.env.DATABASE_URL;

function getPool() {
  // object with connection values we can pass to new Pool() to connect to DB
  const dbConfig = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
  };

  // if DATABASE_URL is set as an environmental variable (from Render), use that
  // otherwise, use the config object we defined above
  let pool = null;
  if (DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    pool = new Pool(dbConfig);
  }
  return pool;
}

//module.exports = { getPool };
export default getPool;
