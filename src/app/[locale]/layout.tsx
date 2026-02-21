import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "UZ CS2 Boost | Competitive Edge for Uzbekistan CS2 Players",
  description:
    "Enhance your CS2 experience with ping optimization, spray training, FACEIT community tools, and more. Built for players in Uzbekistan.",
  keywords: [
    "CS2",
    "Counter-Strike 2",
    "Uzbekistan",
    "FACEIT",
    "ping booster",
    "spray simulator",
    "esports",
    "gaming",
  ],
  openGraph: {
    title: "UZ CS2 Boost",
    description: "Competitive edge for Uzbekistan CS2 players",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
