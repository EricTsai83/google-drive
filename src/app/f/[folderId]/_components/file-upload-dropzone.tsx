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

type UploadProcess = {
  id: string;
  description: string;
  resolve: (value: { name: string }) => void;
  reject: (reason?: unknown) => void;
};

export function FileUploadDropzone({
  currentFolderId,
  setIsOpen,
}: {
  currentFolderId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useRouter();
  // State for storing files awaiting upload
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
  // Ref to keep track of all selected files
  const allFilesRef = useRef<FileToUpload[]>([]);
  // Ref to store the current batch id for the upload process
  const currentBatchIdRef = useRef<string | null>(null);
  // Ref mapping batch id to its upload process details
  const uploadProcessesRef = useRef<Map<string, UploadProcess>>(new Map());

  // Function to add new files to the upload list
  const addFiles = (newFiles: FileList | File[]) => {
    // Generate a new batch id if one hasn't been set
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
        // Provide the File objects before uploading begins
        onBeforeUploadBegin={() =>
          allFilesRef.current.map((fileObj) => fileObj.file)
        }
        onUploadBegin={(fileName) => {
          // Get the current batch id; if a process already exists, do nothing
          const batchId = currentBatchIdRef.current;
          if (!batchId || uploadProcessesRef.current.has(batchId)) return;

          const uniqueToastId = nanoid();
          // Choose a description based on the number of files selected
          const description =
            filesToUpload.length > 1
              ? `${filesToUpload.length} files`
              : fileName;

          let localResolve: (value: { name: string }) => void;
          let localReject: (reason?: unknown) => void;
          // Create a promise to track the upload status
          const uploadPromise = new Promise<{ name: string }>(
            (resolve, reject) => {
              localResolve = resolve;
              localReject = reject;
            },
          );

          // Save the upload process for this batch
          uploadProcessesRef.current.set(batchId, {
            id: uniqueToastId,
            description,
            resolve: localResolve!,
            reject: localReject!,
          });

          // Close the upload dialog
          setIsOpen(false);
          // Display a toast notification tracking the upload status
          toast.promise(uploadPromise, {
            id: uniqueToastId,
            loading: (
              <LoadingToast
                title="File Upload Status"
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
        // Update the toast progress during file upload
        onUploadProgress={(progressValue) => {
          uploadProcessesRef.current.forEach((process) => {
            toast.loading(
              <LoadingToast
                title="File Upload Status"
                description={`Uploading ${process.description}`}
                progress={progressValue}
              />,
              { id: process.id },
            );
          });
        }}
        // Once the client completes the upload, resolve the upload process
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
          // Clear the files state and refresh the page
          setFilesToUpload([]);
          allFilesRef.current = [];
          navigate.refresh();
        }}
        // Handle upload errors
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
        // Pass additional input parameters to the upload endpoint
        input={{ folderId: currentFolderId }}
        // When file selection changes, add the new files
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
                        // Prevent event propagation
                        event.preventDefault();
                        event.stopPropagation();
                        // Remove the selected file from the list
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
          // Button content changes based on the upload state
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
