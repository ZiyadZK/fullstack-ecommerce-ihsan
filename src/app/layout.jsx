
import { poppins } from "@/libs/fonts";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Toaster } from "sonner";

export const metadata = {
  title: "Coca Cola Store",
  description: "Generated by NextJS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <AppRouterCacheProvider options={{ key: 'css'}}>
          <Toaster richColors />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
