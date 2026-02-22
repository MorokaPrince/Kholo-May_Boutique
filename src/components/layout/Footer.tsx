import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

// ===========================================
// Footer Component
// ===========================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-luxury py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl mb-4">
              Join Our Newsletter
            </h3>
            <p className="text-white/70 mb-6">
              Subscribe to receive updates on new arrivals, special offers, and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-luxury-black font-medium hover:bg-luxury-cream transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-2xl tracking-tight">
                Kholo & May
              </span>
            </Link>
            <p className="text-white/70 text-sm mb-6">
              South Africa's premier destination for luxury perfumes, Forever Living products, and exclusive fashion.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', href: '/shop' },
                { label: 'New Arrivals', href: '/shop?new=true' },
                { label: 'Best Sellers', href: '/shop?bestseller=true' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-lg mb-6">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: 'Perfumes', href: '/shop?category=perfumes' },
                { label: 'Forever Living', href: '/shop?category=forever-living' },
                { label: 'Clothing', href: '/shop?category=clothing' },
                { label: 'Gift Sets', href: '/shop?category=gift-sets' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/70" />
                <span className="text-white/70 text-sm">
                  Johannesburg, South Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-white/70" />
                <a
                  href="tel:+27123456789"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  +27 12 345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-white/70" />
                <a
                  href="mailto:info@kholomayboutique.co.za"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  info@kholomayboutique.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} Kholo & May Boutique (Pty) Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-white/50 text-xs uppercase tracking-wider">
              Secure Payments:
            </span>
            <div className="flex items-center gap-3">
              {/* Payment Icons */}
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">VISA</div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">Mastercard</div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">Payflex</div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">PayJustNow</div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">Instant EFT</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
