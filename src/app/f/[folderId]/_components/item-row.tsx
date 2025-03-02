import type { files_table, folders_table } from "@/server/db/schema";
import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { ActionDropdownMenu } from "./action-dropdown-menu";
import { format } from "date-fns";

export function ItemRow({
  item,
  type,
}: {
  item: typeof files_table.$inferSelect | typeof folders_table.$inferSelect;
  type: "file" | "folder";
}) {
  const Icon = type === "folder" ? FolderIcon : FileIcon;

  return (
    <li className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4">
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          {type === "folder" ? (
            <Link
              href={`/f/${item.id}`}
              className="flex items-center text-gray-100 hover:text-blue-400"
            >
              <Icon className="mr-3" size={20} />
              {item.name}
            </Link>
          ) : (
            // use modal to open the image file
            <Link
              className="flex items-center text-gray-100 hover:text-blue-400"
              href={`/img/${item.id}`}
            >
              <Icon className="mr-3" size={20} />
              {item.name}
            </Link>
          )}
        </div>
        <div className="col-span-2 text-gray-400">
          {format(item.lastModified, "yyyy-MM-dd")}
        </div>
        <div className="col-span-3 text-gray-400">
          {type === "file"
            ? (item as typeof files_table.$inferSelect).size
            : "—"}
        </div>
        <div className="col-span-1 text-gray-400">
          <ActionDropdownMenu id={item.id} name={item.name} type={type} />
        </div>
      </div>
    </li>
  );
}
