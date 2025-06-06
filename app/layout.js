import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: 'E-commerce App',
  description: 'A modern e-commerce application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
