"use client";

import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FileToUpload = {
  name: string;
  file: File;
};

export function FileUploadDialog({
  currentFolderId,
}: {
  currentFolderId: number;
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
    <div className="mt-10">
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
        onUploadBegin={(name) => {
          // Do something once upload begins
          console.log("Uploading: ", name);
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
          button({ isUploading, uploadProgress }) {
            return {
              ...(isUploading && {
                position: "relative",
                "&::after": {
                  content: `'${uploadProgress}%'`, // show progress percentage
                },
              }),
            };
          },
          container: "cursor-pointer bg-slate-800",
          label:
            "w-full h-full flex flex-col justify-start mt-0 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0",
          uploadIcon: filesToUpload.length > 0 ? "hidden" : undefined,
          allowedContent: filesToUpload.length > 0 ? "hidden" : undefined,
        }}
        content={{
          label:
            filesToUpload.length > 0 ? (
              <div className="h-full w-full rounded-md bg-slate-900 p-4 text-gray-300">
                {filesToUpload.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between border-b border-gray-700 px-2"
                  >
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      onClick={(event) => removeFile(event, file.name)}
                      className="ml-2 rounded p-1 hover:bg-slate-700"
                    >
                      <X
                        size={16}
                        className="text-gray-300 hover:text-red-400"
                      />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-400">
                Choose file(s) or drag and drop
              </p>
            ),
          button: ({ ready, isUploading, uploadProgress }) => {
            if (!ready) return "Loading...";
            if (isUploading) {
              return <span className="z-50 text-sm">{uploadProgress}%</span>;
            }
            if (filesToUpload.length > 0)
              return `Upload ${filesToUpload.length} file${filesToUpload.length > 1 ? "s" : ""}`;

            return "Choose File(s)";
          },
        }}
      />
    </div>
  );
}
