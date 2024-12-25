import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello Earth",
  description: "A minimal Next.js project with Tailwind CSS and Mapbox integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={"antialiased"}
      >
        {children}
      </body>
    </html>
  );
}
