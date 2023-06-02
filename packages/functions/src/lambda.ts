import { db } from "src/db";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (event) => {

  // Here you can then use prisma
  const account = await db.account.findFirst();

  return {
    body: `Hello world.`,
  };
});
