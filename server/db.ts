// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import ws from "ws";
// import * as schema from "@shared/schema";

// neonConfig.webSocketConstructor = ws;

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });


import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Ensure DATABASE_URL is properly formatted
const databaseUrl = process.env.DATABASE_URL.startsWith('postgres://') || 
                   process.env.DATABASE_URL.startsWith('postgresql://') ? 
                   process.env.DATABASE_URL : 
                   `postgresql://${process.env.DATABASE_URL}`;

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
