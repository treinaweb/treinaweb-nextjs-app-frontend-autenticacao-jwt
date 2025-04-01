import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import { logout } from "./auth/login/actions";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TreinaBlog",
  description: "Aplicação desenvolvida no curso de Next.js Fundamentos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = (await cookies()).has("auth-token");

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <h1 className={styles.title}>
            Treina
            <span className={styles.titleSecondWord}>Blog</span>
          </h1>
          <nav>
            {isAuthenticated ? (
              <form action={logout}>
              <button type="submit">
                logout
              </button>
            </form>
            ) : (
              <Link href={"/auth/login"}>
               <button>
                login
              </button>
              </Link>
            )}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
