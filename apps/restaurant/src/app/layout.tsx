import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EatSome Restaurant Dashboard",
  description: "Restaurant management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
} 