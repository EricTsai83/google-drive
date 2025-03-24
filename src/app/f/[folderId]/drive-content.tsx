"use client";

import { ChevronRight } from "lucide-react";
import { ItemRow } from "./_components/item-row";
import type { files_table, folders_table } from "@/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FileUploadDialog } from "./_components/file-upload-dialog";
import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";

type DriveContentsProps = {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
};

export default function DriveContents({
  files,
  folders,
  parents,
  currentFolderId,
}: DriveContentsProps) {
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <BreadcrumbNav parents={parents} />
          <AuthButtons />
        </header>

        <div className="mb-4 flex justify-end">
          <CreateFolderDialog currentFolderId={currentFolderId} />
        </div>

        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <TableHeader />
          </div>
          <ul>
            {folders.map((folder) => (
              <ItemRow key={folder.id} item={folder} type="folder" />
            ))}
            {files.map((file) => (
              <ItemRow key={file.id} item={file} type="file" />
            ))}
          </ul>
        </div>
        <FileUploadDialog currentFolderId={currentFolderId} />
      </div>
    </div>
  );
}

function BreadcrumbNav({
  parents,
}: {
  parents: DriveContentsProps["parents"];
}) {
  return (
    <div className="flex items-center">
      <Link href="/" className="mr-2 text-gray-300 hover:text-white">
        My Drive
      </Link>
      {parents.map((folder) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="mx-2 text-gray-500" size={16} />
          <Link
            href={`/f/${folder.id}`}
            className="text-gray-300 hover:text-white"
          >
            {folder.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

function AuthButtons() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
      <div className="col-span-6">Name</div>
      <div className="col-span-2">Last Modified</div>
      <div className="col-span-3">Size</div>
      <div className="col-span-1"></div>
    </div>
  );
}
