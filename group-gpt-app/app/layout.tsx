import type { Metadata } from "next";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header/header";
import { Providers } from "@/components/providers";
import { Inter,Noto_Sans_SC } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const notoSansSC = Noto_Sans_SC({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Agent Playground",
  description: "Make Agent For Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={notoSansSC.className}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
