"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFile, deleteFolder } from "@/server/actions";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

type FileDropdownMenuProps = {
  fileId: number;
};

export function FileDropdownMenu({ fileId }: FileDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hover:cursor-pointer">
          <span className="sr-only">{"Open file's row actions"}</span>
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-500"
          onClick={async () => {
            try {
              await deleteFile(fileId);
              toast.success("File deleted successfully");
            } catch (error) {
              toast.error(
                `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }
          }}
          aria-label="Delete File"
        >
          <Trash2Icon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FolderDropdownMenuProps = {
  folderId: number;
};

export function FolderDropdownMenu({ folderId }: FolderDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hover:cursor-pointer">
          <span className="sr-only">{"Open folder's row actions"}</span>
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-500"
          onClick={async () => {
            try {
              await deleteFolder(folderId);
              toast.success("Folder deleted successfully");
            } catch (error) {
              toast.error(
                `Failed to delete folder: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }
          }}
          aria-label="Delete Folder"
        >
          <Trash2Icon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
