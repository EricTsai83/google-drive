import { index, integer, pgTableCreator, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `google-drive_${name}`);

export const files = createTable(
  "files",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    size: integer("size").notNull(),
    url: varchar("url", { length: 256 }).notNull(),
    parent: integer("parent").notNull(),
  },
  (t) => ({
    parentIndex: index("files_parent_idx").on(t.parent),
  }),
);

export const folders = createTable(
  "folders",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    parent: integer("parent"),
  },
  (t) => ({
    parentIndex: index("folders_parent_idx").on(t.parent),
  }),
);
