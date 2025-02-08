import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";

// Configure IBM Plex Sans
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "imageAI",
  description: "AI-powered Image Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={
        {
          baseTheme: dark,
          variables: { colorPrimary: '#624cf5' },
          layout:{
            logoImageUrl: '/favicon.png'
          }
        }}>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.png" type="image/png" />
        </head>
        <body className={cn("font-sans antialiased text-white", ibmPlexSans.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
