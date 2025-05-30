import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { LogoCloud } from "@/components/logo-cloud";
import { GetStartedButton } from "@/components/get-started-button";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HomePage() {
  return (
    <>
      <main>
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
              >
                Google Drive Clone, But Worse
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
              >
                Learn from Theo, the best software dev nerd in the world.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12"
              >
                <form
                  action={async () => {
                    "use server";

                    const session = await auth();

                    if (!session.userId) {
                      return redirect("/sign-in");
                    }

                    return redirect("/drive");
                  }}
                  className="mx-auto max-w-sm"
                >
                  <div className="shadow shadow-zinc-950/5">
                    {/* <Button className="w-full" size="lg" type="submit">
                      Get Started
                    </Button> */}

                    <GetStartedButton />
                  </div>
                </form>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <div className="mt-24 w-full">
          <LogoCloud />
        </div>
      </main>

      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Eric Tsai. All rights reserved.
      </footer>
    </>
  );
}
