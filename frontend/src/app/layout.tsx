import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MuiRegistry from "@/components/MuiRegistry";
import MainLayout from "@/components/layout/MainLayout";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Estoque Gestor",
  description: "Sistema de Gestão de Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReactQueryProvider>
          <MuiRegistry>
            <MainLayout>{children}</MainLayout>
          </MuiRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
