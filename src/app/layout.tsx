import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Vortexis | The All-in-One Hackathon & Collaboration Platform",
  description: "Host, join, and judge hackathons on Vortexis. Build teams, collaborate with partners, manage project submissions, coordinate evaluations, and innovate together on the ultimate all-in-one hackathon platform.",
  keywords: ["hackathon", "collaboration", "software development", "project submission", "hackathon platform", "judge evaluation"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors overflow-x-hidden">
          <ClientLayout>{children}</ClientLayout>
        </body>
      </Provider>
    </html>
  );
}
