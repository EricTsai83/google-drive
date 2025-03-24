import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 text-5xl font-bold md:text-6xl">
        Google Drive Clone, But Worse
      </h1>
      <p className="mx-auto mb-8 max-w-md text-xl md:text-2xl">
        {"Learn from Theo, the best software dev nerd in the world."}
      </p>
      <form
        action={async () => {
          "use server";

          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          return redirect("/drive");
        }}
      >
        <Button size="lg" type="submit">
          Get Started
        </Button>
      </form>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Eric Tsai. All rights reserved.
      </footer>
    </>
  );
}
