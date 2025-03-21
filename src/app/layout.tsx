import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AuthProvider from "@/components/ui/AuthProvider";

export const metadata: Metadata = {
  title: "VORTEXIS",
  description: "Vortexis by Web3bridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
        </AuthProvider>

        {children}
        <Footer />
      </body>
    </html>
  );
}
