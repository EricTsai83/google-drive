"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { files_table } from "./db/schema";
import { eq, and } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  // delete the file from uploadthing
  const utApiResult = await utApi.deleteFiles([file.utFileKey]);

  console.log(utApiResult);

  // delete the file from the database
  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  // use this method to force a refresh of the page
  // this is the same way that revalidatePath works but without the need for a specific path
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
