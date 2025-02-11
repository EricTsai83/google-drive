import { db } from "@/server/db";
import {
  files as fileSchema,
  folders as folderSchema,
} from "@/server/db/schema";
import DriveContents from "../../drive-content";
import { eq } from "drizzle-orm/expressions";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parseFolderId = parseInt(params.folderId);
  if (isNaN(parseFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const folders = await db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, parseFolderId));

  const files = await db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parent, parseFolderId));

  return <DriveContents files={files} folders={folders} />;
}
