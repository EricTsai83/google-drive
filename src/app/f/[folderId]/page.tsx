import { db } from "@/server/db";
import {
  files as fileSchema,
  folders as folderSchema,
} from "@/server/db/schema";
import DriveContents from "../../drive-content";
import { eq } from "drizzle-orm/expressions";

async function getAllparents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folderSchema)
      .where(eq(folderSchema.id, currentId));

    if (!folder[0]) {
      throw new Error("parent folder not found");
    }

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }
  return parents;
}

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parseFolderId = parseInt(params.folderId);
  if (isNaN(parseFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const foldersPromise = db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, parseFolderId));

  const filesPromise = db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parent, parseFolderId));

  const parentsPromise = getAllparents(parseFolderId);

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  return <DriveContents folders={folders} files={files} parents={parents} />;
}
