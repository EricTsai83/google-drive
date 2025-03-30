"use client";

import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingToast } from "@/components/loading-toast";

type FileToUpload = {
  name: string;
  file: File;
};

interface UploadProcess {
  id: string;
  description: string;
  resolve: (value: { name: string }) => void;
  reject: (reason?: unknown) => void;
}

export function FileUploadDropzone({
  currentFolderId,
  setIsOpen,
}: {
  currentFolderId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useRouter();
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
  const allFilesRef = useRef<FileToUpload[]>([]);
  const currentBatchIdRef = useRef<string | null>(null);
  const uploadProcessesRef = useRef<Map<string, UploadProcess>>(new Map());

  const addFiles = (newFiles: FileList | File[]) => {
    // Force a new batch by clearing previous files.
    if (!currentBatchIdRef.current) {
      currentBatchIdRef.current = nanoid();
    }

    const formattedFiles = Array.from(newFiles).map((file) => ({
      name: file.name,
      file,
    }));

    setFilesToUpload((prev) => {
      const updatedFiles = [...prev, ...formattedFiles];
      allFilesRef.current = updatedFiles;
      return updatedFiles;
    });
  };

  return (
    <>
      <UploadDropzone
        endpoint="driveUploader"
        onBeforeUploadBegin={() =>
          allFilesRef.current.map((fileObj) => fileObj.file)
        }
        onUploadBegin={(fileName) => {
          const batchId = currentBatchIdRef.current;
          if (!batchId || uploadProcessesRef.current.has(batchId)) return;

          const uniqueToastId = nanoid();
          const description =
            filesToUpload.length > 1
              ? `${filesToUpload.length} files`
              : fileName;

          let localResolve: (value: { name: string }) => void;
          let localReject: (reason?: unknown) => void;
          const uploadPromise = new Promise<{ name: string }>(
            (resolve, reject) => {
              localResolve = resolve;
              localReject = reject;
            },
          );

          uploadProcessesRef.current.set(batchId, {
            id: uniqueToastId,
            description,
            resolve: localResolve!,
            reject: localReject!,
          });

          setIsOpen(false);
          toast.promise(uploadPromise, {
            id: uniqueToastId,
            loading: (
              <LoadingToast
                title="Uploading"
                description={`Uploading ${description}`}
                progress={0}
              />
            ),
            success: (data: { name: string }) => ({
              message: "Upload Complete",
              description: `Uploaded ${data.name}`,
            }),
            error: "Failed to upload files",
          });
        }}
        onUploadProgress={(progressValue) => {
          uploadProcessesRef.current.forEach((process) => {
            toast.loading(
              <LoadingToast
                title="Uploading"
                description={`Uploading ${process.description}`}
                progress={progressValue}
              />,
              { id: process.id },
            );
          });
        }}
        onClientUploadComplete={() => {
          const batchId = currentBatchIdRef.current;
          if (batchId) {
            const process = uploadProcessesRef.current.get(batchId);
            if (process) {
              process.resolve({ name: process.description });
              uploadProcessesRef.current.delete(batchId);
            }
            currentBatchIdRef.current = null;
          }
          setFilesToUpload([]);
          allFilesRef.current = [];
          navigate.refresh();
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
          const batchId = currentBatchIdRef.current;
          if (batchId) {
            const process = uploadProcessesRef.current.get(batchId);
            if (process) {
              process.reject(error);
              uploadProcessesRef.current.delete(batchId);
            }
            currentBatchIdRef.current = null;
          }
        }}
        input={{ folderId: currentFolderId }}
        onChange={(acceptedFiles) => addFiles(acceptedFiles)}
        appearance={{
          button:
            "ut-ready:bg-red-500 ut-uploading:cursor-not-allowed bg-red-400 bg-none after:bg-red-500 ut-uploading:pointer-events-none focus:outline-none focus:ring-0 focus:ring-offset-0",
          container:
            "cursor-pointer ut-uploading:pointer-events-none h-[400px]",
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
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setFilesToUpload((prev) => {
                          const updated = prev.filter(
                            (f) => f.name !== file.name,
                          );
                          allFilesRef.current = updated;
                          return updated;
                        });
                      }}
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
          button: ({ ready, isUploading, uploadProgress }) => {
            if (!ready) return "Loading...";
            if (isUploading) {
              return <span className="z-50 text-sm">{uploadProgress}%</span>;
            }
            if (filesToUpload.length > 0)
              return `Upload ${filesToUpload.length} file${
                filesToUpload.length > 1 ? "s" : ""
              }`;
            return "Choose File(s)";
          },
        }}
      />
    </>
  );
}
