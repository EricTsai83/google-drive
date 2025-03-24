"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CloudUpload } from "lucide-react";
import { useState } from "react";
import { FileUploadDropzone } from "./file-upload-dropzone";

export function FileUploadDropzoneDialog({
  currentFolderId,
}: {
  currentFolderId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CloudUpload /> Upload File(s)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="">Upload files</DialogTitle>
        <DialogDescription className="sr-only">
          Upload files to your Drive
        </DialogDescription>
        <FileUploadDropzone currentFolderId={currentFolderId} />
      </DialogContent>
    </Dialog>
  );
}
