import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// We import Poppins from next/font/google to ensure it is optimized
// and we don't have layout shift.
const poppins = Poppins({
  variable: "--font-sans", // Setting variable so Tailwind can use it
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Including weights we might need
});

export const metadata: Metadata = {
  title: "CartKoi | Find the Best Food Carts",
  description: "A multi-tenant platform for food carts in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      {/* 
        min-h-full flex flex-col ensures that the page takes up at least 
        the full viewport height, preventing awkward empty spaces.
      */}
      <body className="min-h-full flex flex-col relative">{children}</body>
    </html>
  );
}
