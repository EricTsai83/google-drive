"use client";

import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingToast } from "@/components/loading-toast";

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
  // Using a ref to accumulate the latest file list
  const allFilesRef = useRef<FileToUpload[]>([]);
  // To store a unique toast id
  const uploadToastIdRef = useRef<string | number | null>(null);
  // Use counter to generate a unique id
  const toastCounterRef = useRef(0);

  // Storing the resolve/reject functions of the upload promise
  const uploadPromiseRef = useRef<{
    resolve: (value: { name: string }) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  // To store the description to be displayed in the toast
  const currentToastDescriptionRef = useRef("");

  // Encapsulate a function to update files in both state and ref
  const addFiles = (newFiles: FileList | File[]) => {
    // First, convert files to our format
    const formattedFiles = Array.from(newFiles).map((file) => ({
      name: file.name,
      file,
    }));
    setFilesToUpload((prev) => {
      const updated = [...prev, ...formattedFiles];
      // Ensure the ref is updated synchronously
      allFilesRef.current = updated;
      return updated;
    });
  };

  function removeFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setFilesToUpload((prev) => {
      const updated = prev.filter((file) => file.name !== fileName);
      allFilesRef.current = updated;
      return updated;
    });
  }

  return (
    <>
      <UploadDropzone
        endpoint="driveUploader"
        onClientUploadComplete={() => {
          if (uploadPromiseRef.current) {
            uploadPromiseRef.current.resolve({
              name: currentToastDescriptionRef.current,
            });
            uploadPromiseRef.current = null;
          }
          if (uploadToastIdRef.current) {
            uploadToastIdRef.current = null;
          }
          // Clear files after upload completes
          setFilesToUpload([]);
          allFilesRef.current = [];
          navigate.refresh();
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
          if (uploadPromiseRef.current) {
            uploadPromiseRef.current.reject(error);
            uploadPromiseRef.current = null;
          }
          if (uploadToastIdRef.current) {
            uploadToastIdRef.current = null;
          }
        }}
        onBeforeUploadBegin={() => {
          // Directly read the latest file list from the ref
          console.log("Accumulated files:", allFilesRef.current);
          // If a File[] is needed, you can further map the files.
          // Here we directly return our formatted files array.
          return allFilesRef.current.map((fileObj) => fileObj.file);
        }}
        onUploadBegin={(fileName) => {
          if (!uploadToastIdRef.current) {
            setIsOpen(false);
            currentToastDescriptionRef.current =
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
            uploadPromiseRef.current = {
              resolve: localResolve!,
              reject: localReject!,
            };

            toastCounterRef.current += 1;
            const uniqueToastId = `upload-${toastCounterRef.current}`;

            toast.promise(uploadPromise, {
              id: uniqueToastId,
              loading: (
                <LoadingToast
                  title="Uploading"
                  description={`Uploading ${currentToastDescriptionRef.current}`}
                  progress={0}
                />
              ),
              success: (data: { name: string }) => ({
                message: "Upload Complete",
                description: `Successfully uploaded ${data.name}`,
              }),
              error: "Failed to upload files",
            });
            uploadToastIdRef.current = uniqueToastId;
          }
        }}
        onUploadProgress={(progressValue) => {
          if (uploadToastIdRef.current) {
            toast.loading(
              <LoadingToast
                title="Uploading"
                description={`Uploading ${currentToastDescriptionRef.current}`}
                progress={progressValue}
              />,
              { id: uploadToastIdRef.current },
            );
          }
        }}
        input={{ folderId: currentFolderId }}
        onChange={(acceptedFiles) => {
          // Use the custom addFiles function to update both state and ref
          addFiles(acceptedFiles);
        }}
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
