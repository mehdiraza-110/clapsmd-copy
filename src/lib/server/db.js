import { Pool } from "pg";

const rawConnectionString = process.env.SUPABASE_DB_URL;

if (!rawConnectionString) {
  throw new Error("SUPABASE_DB_URL is not set");
}

function parseSupabaseConnectionString(value) {
  const trimmed = String(value).trim().replace(/^["']|["']$/g, "");
  const match = trimmed.match(/^postgres(?:ql)?:\/\/([^:]+):(.+)@([^:/]+):(\d+)\/([^?]+)$/i);

  if (!match) {
    throw new Error("SUPABASE_DB_URL format is invalid");
  }

  const [, user, rawPassword, host, port, database] = match;
  const password = rawPassword.replace(/^\[/, "").replace(/\]$/, "");

  return {
    user,
    password,
    host,
    port: Number(port),
    database,
  };
}

function createPool() {
  const parsedConfig = parseSupabaseConnectionString(rawConnectionString);

  const pool = new Pool({
    ...parsedConfig,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  pool.on("error", (err) => {
    console.error("SUPABASE DB ERROR:", err);
  });

  return pool;
}

// Cached on globalThis so Next.js dev-mode HMR and serverless invocation reuse
// don't open a new pg Pool on every module reload.
const supabaseDb = globalThis.__clapsmdSupabaseDb || createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__clapsmdSupabaseDb = supabaseDb;
}

export const query = (command, params) => supabaseDb.query(command, params);
export { supabaseDb };
