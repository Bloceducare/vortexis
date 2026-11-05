import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://vortexis.web3bridgegarage.com"),
  title: "Vortexis | The All-in-One Hackathon & Collaboration Platform",
  description: "Host, join, and judge hackathons on Vortexis. Build teams, collaborate with partners, manage project submissions, coordinate evaluations, and innovate together on the ultimate all-in-one hackathon platform.",
  keywords: ["hackathon", "collaboration", "software development", "project submission", "hackathon platform", "judge evaluation"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Vortexis | The All-in-One Hackathon & Collaboration Platform",
    description: "Host, join, and judge hackathons on Vortexis. Build teams, collaborate with partners, manage project submissions, coordinate evaluations, and innovate together on the ultimate all-in-one hackathon platform.",
    images: [{ url: "/og-image-1200x630.png", width: 1200, height: 630, alt: "Vortexis" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image-1200x630.png"],
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
