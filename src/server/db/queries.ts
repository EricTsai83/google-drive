import "server-only";

import { db } from "@/server/db";
import {
  type DB_FileType,
  files_table as fileSchema,
  folders_table as folderSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm/expressions";

export const QUERIES = {
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.parent, folderId));
  },
  getFiles: function (folderId: number) {
    return db.select().from(fileSchema).where(eq(fileSchema.parent, folderId));
  },
  getAllParentsForFolder: async function (folderId: number) {
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
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db
      .insert(fileSchema)
      .values({ ...input.file, parent: input.file.parent });
  },
};
