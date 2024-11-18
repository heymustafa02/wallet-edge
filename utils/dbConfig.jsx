import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://Wallet%20edge_owner:i9vP3HTqUnQh@ep-proud-forest-a1y0vy4o.ap-southeast-1.aws.neon.tech/Wallet%20edge?sslmode=require"
);
export const db = drizzle(sql, { schema });