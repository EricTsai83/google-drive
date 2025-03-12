"use client";

import type { files_table, folders_table } from "@/server/db/schema";
import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { ActionDropdownMenu } from "./action-dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { cn, formatFileSize } from "@/lib/utils";

export function ItemRow({
  item,
  type,
}: {
  item: typeof files_table.$inferSelect | typeof folders_table.$inferSelect;
  type: "file" | "folder";
}) {
  const Icon = type === "folder" ? FolderIcon : FileIcon;
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <li
      className={cn("border-b border-gray-700 px-6 py-4 hover:bg-gray-700", {
        "animate-pulse bg-gray-600": isDeleting,
      })}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          {type === "folder" ? (
            <Link
              className={cn(
                "flex items-center text-gray-100 hover:text-blue-400",
                { "cursor-not-allowed": isDeleting },
              )}
              href={`/f/${item.id}`}
              onClick={(e) => isDeleting && e.preventDefault()}
            >
              <Icon className="mr-3" size={20} />
              <span className={cn({ "line-through": isDeleting })}>
                {item.name}
              </span>
            </Link>
          ) : (
            // use modal to open the image file
            <Link
              className={cn(
                "flex items-center text-gray-100 hover:text-blue-400",
                { "cursor-not-allowed": isDeleting },
              )}
              href={`/img/${item.id}`}
              onClick={(e) => isDeleting && e.preventDefault()}
            >
              <Icon className="mr-3" size={20} />
              <span className={cn({ "line-through": isDeleting })}>
                {item.name}
              </span>
            </Link>
          )}
        </div>
        <div className="col-span-2 text-gray-400">
          {format(new Date(item.lastModified), "yyyy-MM-dd")}
        </div>
        <div className="col-span-3 text-gray-400">
          {type === "file"
            ? formatFileSize((item as typeof files_table.$inferSelect).size)
            : "—"}
        </div>
        <div className="col-span-1 text-gray-400">
          <ActionDropdownMenu
            id={item.id}
            name={item.name}
            type={type}
            setIsDeleting={setIsDeleting}
          />
        </div>
      </div>
    </li>
  );
}
