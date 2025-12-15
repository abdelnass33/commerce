import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Sneaker Commerce - Sneakers & Streetwear",
  description: "Shop the latest sneakers and streetwear fashion",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-dark-bg">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c1e',
              color: '#ffffff',
              border: '1px solid #38383a',
            },
          }}
        />
      </body>
    </html>
  );
}
