import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Kholo & May Boutique | Luxury Fashion & Lifestyle',
    template: '%s | Kholo & May Boutique',
  },
  description: 'Discover luxury perfumes, Forever Living products, and exclusive fashion at Kholo & May Boutique. South Africa\'s premier destination for elegant lifestyle products.',
  keywords: [
    'luxury boutique',
    'perfumes',
    'Forever Living',
    'fashion',
    'South Africa',
    'designer clothing',
    'premium products',
    'Kholo May Boutique',
  ],
  authors: [{ name: 'Kholo & May Boutique' }],
  creator: 'Kholo & May Boutique',
  publisher: 'Kholo & May Boutique (Pty) Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://kholomayboutique.co.za',
    siteName: 'Kholo & May Boutique',
    title: 'Kholo & May Boutique | Luxury Fashion & Lifestyle',
    description: 'Discover luxury perfumes, Forever Living products, and exclusive fashion at Kholo & May Boutique.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kholo & May Boutique',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kholo & May Boutique | Luxury Fashion & Lifestyle',
    description: 'Discover luxury perfumes, Forever Living products, and exclusive fashion at Kholo & May Boutique.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased bg-luxury-white text-luxury-black">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
