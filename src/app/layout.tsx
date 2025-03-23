import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Google Drive Clone",
  description: "It's like Google Drive, but worse!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <PostHogProvider>
            <main>{children}</main>
            {modal}
            <div id="modal-root" />
            <Toaster richColors />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
