import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import FloatingCartButton from "./components/FloatingCartButton";
import HashRouter from "./components/HashRouter";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "pk crackers",
  description: "Quality crackers and fireworks supplier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <HashRouter>
            {children}
            <CartModal />
            <FloatingCartButton />
          </HashRouter>
        </CartProvider>
      </body>
    </html>
  );
}
