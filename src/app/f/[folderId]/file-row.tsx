import type { files_table, folders_table } from "@/server/db/schema";
import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { FileDropdownMenu, FolderDropdownMenu } from "./action-dropdown-menu";
import { format } from "date-fns";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-gray-400">
          {format(file.lastModified, "yyyy-MM-dd")}
        </div>
        <div className="col-span-3 text-gray-400">{file.size}</div>
        <div className="col-span-1 text-gray-400">
          <FileDropdownMenu fileId={file.id} />
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="border-b border-gray-700 px-6 py-4 hover:bg-gray-700"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">
          {format(folder.lastModified, "yyyy-MM-dd")}
        </div>
        <div className="col-span-3 text-gray-400">—</div>
        <div className="col-span-1 text-gray-400">
          <FolderDropdownMenu folderId={folder.id} />
        </div>
      </div>
    </li>
  );
}
