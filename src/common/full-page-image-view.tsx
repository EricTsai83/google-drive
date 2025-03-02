// import { Button } from "@/components/ui/button";
import { type files_table } from "@/server/db/schema";
import { BlurImage } from "@/components/blur-image";

export function FullPageImageView({
  image,
}: {
  image: typeof files_table.$inferSelect;
}) {
  return (
    <div className="flex h-full w-screen min-w-0 items-center justify-center text-white">
      <div className="flex-shrink flex-grow">
        <BlurImage src={image.url} width={1000} height={1000} alt="" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img src={image.url} className="object-contain" alt={image.name} /> */}
      </div>
      <div className="flex h-full w-56 flex-shrink-0 flex-col border-l">
        <div className="border-b p-2 text-center text-xl">{image.name}</div>

        <div className="p-2">
          <div>Uploaded By:</div>
          <div>{image.ownerId}</div>
        </div>

        <div className="p-2">
          <div>Created On:</div>
          <div>{image.createdAt.toLocaleDateString()}</div>
        </div>

        <div className="p-2">
          {/* <form
            action={async () => {
              "use server";

              await deleteImage(idAsNumber);
            }}
          >
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form> */}
        </div>
      </div>
    </div>
  );
}
