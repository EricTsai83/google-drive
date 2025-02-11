import { db } from "@/server/db";
import { mockFolders, mockFiles } from "@/lib/mock-data";
import { files, folders } from "@/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";

          try {
            // Clear existing data first
            // await db.delete(files);
            // await db.delete(folders);
            // // Delete in correct order due to foreign key constrain
            // First insert all folders and get their IDs
            const folderInsert = await db
              .insert(folders)
              .values(
                mockFolders.map((folder, index) => ({
                  name: folder.name,
                  parent: index !== 0 ? 1 : null,
                })),
              )
              .returning(); // This will return the inserted records
            console.log("Folder insert result:", folderInsert);

            // Then insert files
            const fileInsert = await db
              .insert(files)
              .values(
                mockFiles.map((file, index) => ({
                  name: file.name,
                  size: 50000,
                  url: file.url,
                  parent: (index % 3) + 1,
                })),
              )
              .returning(); // This will return the inserted records;
            console.log("File insert result:", fileInsert);
          } catch (error) {
            console.error("Detailed error:", error);
            throw error;
          }
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
