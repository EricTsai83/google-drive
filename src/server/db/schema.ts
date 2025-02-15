import {
  bigint,
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `google-drive_${name}`);

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    ownerId: varchar("owner_id", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    size: integer("size").notNull(),
    url: varchar("url", { length: 256 }).notNull(),
    parent: integer("parent").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    parentIndex: index("files_parent_index").on(t.parent),
    ownerIdIndex: index("files_owner_id_index").on(t.ownerId),
  }),
);

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    ownerId: varchar("owner_id", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    parent: integer("parent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    parentIndex: index("folders_parent_index").on(t.parent),
    ownerIdIndex: index("folders_owner_id_index").on(t.ownerId),
  }),
);

export type DB_FolderType = typeof folders_table.$inferSelect;
