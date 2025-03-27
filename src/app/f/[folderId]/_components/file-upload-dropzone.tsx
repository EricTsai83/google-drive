"use client";

import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FileToUpload = {
  name: string;
  file: File;
};

export function FileUploadDropzone({
  currentFolderId,
  setIsOpen,
}: {
  currentFolderId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useRouter();
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);

  function removeFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setFilesToUpload((prev) => prev.filter((file) => file.name !== fileName));
  }

  return (
    <UploadDropzone
      endpoint="driveUploader"
      onClientUploadComplete={() => {
        toast.success("Files uploaded successfully");
        setFilesToUpload([]); // Clear the list after successful upload
        navigate.refresh();
      }}
      onUploadError={(error) => {
        toast.error(`Upload failed: ${error.message}`);
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onBeforeUploadBegin={(files) => {
        // Preprocess files before uploading (e.g. rename them)
        return filesToUpload.map((f) => f.file);
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onUploadBegin={(name) => {
        // Do something once upload begins
        setIsOpen(false);
      }}
      input={{ folderId: currentFolderId }}
      onChange={(acceptedFiles) => {
        // Convert File objects to our FileToUpload interface
        const newFiles = acceptedFiles.map((file) => ({
          name: file.name,
          file: file,
        }));
        setFilesToUpload((prev) => [...prev, ...newFiles]);
      }}
      appearance={{
        button:
          "ut-ready:bg-red-500 ut-uploading:cursor-not-allowed bg-red-400 bg-none after:bg-red-500 ut-uploading:pointer-events-none focus:outline-none focus:ring-0 focus:ring-offset-0",
        container: "cursor-pointer ut-uploading:pointer-events-none h-[400px]",
        label: "flex flex-col justify-start",
        uploadIcon: filesToUpload.length > 0 ? "hidden" : undefined,
        allowedContent: filesToUpload.length > 0 ? "hidden" : undefined,
      }}
      content={{
        label:
          filesToUpload.length > 0 ? (
            <div className="h-full w-full rounded-md p-4 text-secondary-foreground">
              {filesToUpload.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between border-b border-gray-300 px-2"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => removeFile(event, file.name)}
                    className="p-1 hover:bg-transparent hover:text-primary"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-500">
              Choose file(s) or drag and drop
            </p>
          ),
        // button: ({ ready, isUploading, uploadProgress }) => {
        //   if (!ready) return "Loading...";
        //   if (isUploading) {
        //     return <span className="z-50 text-sm">{uploadProgress}%</span>;
        //   }
        //   if (filesToUpload.length > 0)
        //     return `Upload ${filesToUpload.length} file${filesToUpload.length > 1 ? "s" : ""}`;

        //   return "Choose File(s)";
        // },
      }}
    />
  );
}
