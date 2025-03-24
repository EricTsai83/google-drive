"use client";

import { type files_table } from "@/server/db/schema";
import { BlurImage } from "@/components/blur-image";
import ImageDescriptionCard from "@/components/image-description-card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFile } from "@/server/actions";
import { useRouter } from "next/navigation";

export const validImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
];

export function FullPageImageView({
  image,
}: {
  image: typeof files_table.$inferSelect | undefined;
}) {
  const router = useRouter();

  if (!image) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        <p className="text-lg">Image has been deleted or could not be found.</p>
      </div>
    );
  }

  const isValidImageUrl = validImageExtensions.some((ext) =>
    image.name.toLowerCase().endsWith(ext),
  );

  const handleDelete = async () => {
    const result = await deleteFile(image.id);
    if (result.success) {
      router.back(); // Navigate back to previous page
    }
  };

  return (
    <div className="flex h-full w-full min-w-0 items-center justify-center text-white">
      {isValidImageUrl ? (
        <BlurImage
          src={image.url}
          fill
          alt=""
          style={{ objectFit: "contain" }}
        />
      ) : (
        <div>Invalid image format</div>
      )}

      <div className="absolute bottom-10 right-10 z-10">
        <ImageDescriptionCard
          ownerId={image.ownerId}
          createdAt={image.createdAt.toLocaleDateString()}
        />
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={handleDelete}
        className="absolute right-4 top-4 z-10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
