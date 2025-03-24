import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MUTATIONS, QUERIES } from "@/server/db/queries";
import { Suspense } from "react";
import { Loader } from "lucide-react";

function LoadingUI() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900">
        <Loader className="h-full w-full text-primary" />
      </div>
    </div>
  );
}

export default async function DrivePage() {
  // Show loading UI immediately
  return (
    <Suspense fallback={<LoadingUI />}>
      <DrivePageContent />
    </Suspense>
  );
}

async function DrivePageContent() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";
          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          const rootFolderId = await MUTATIONS.onboardUser(session.userId);

          return redirect(`/f/${rootFolderId}`);
        }}
      >
        <Button>Create New Drive</Button>
      </form>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}
