
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


// import Hackathon_Navbar from "@/components/Navbar/hackathon-navbar";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* <Hackathon_Navbar />  */}
        {children}
      </div>
  );
}


