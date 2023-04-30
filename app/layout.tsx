import { Footer } from "./components/footer/footer";
import { AppNavBar } from "./components/header/navbar";
import { SearchBox } from "./components/search-box/search-box";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="halloween">
      <head>
        <title>Best of JS + Next 13</title>
        <meta name="description" content="Best of JS" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <AppNavBar />
          {/* @ts-expect-error Server Component */}
          <SearchBox />
          <div className="flex-auto">
            <div className="app-container py-6">{children}</div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
