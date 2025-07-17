import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` ${nunito.variable} antialiased`}>{children}</div>;
}
