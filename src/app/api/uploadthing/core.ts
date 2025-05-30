import { MUTATIONS, QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  driveUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "32MB",
      maxFileCount: 10,
    },
  })
    .input(
      z.object({
        folderId: z.number(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      const folder = await QUERIES.getFolderById(input.folderId);

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!folder) throw new UploadThingError("Folder not found");

      if (folder.ownerId !== user.userId)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This function if called by uploadthing server when the file is uploaded
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      try {
        await MUTATIONS.createFile({
          file: {
            utFileKey: file.key,
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            parent: metadata.parentId,
          },
          userId: metadata.userId,
        });

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error saving file to database:", error);
        throw new Error("Error saving file to database");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
