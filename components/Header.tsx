'use client';

import { ShoppingBag, User, ShoppingCart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export default function Header() {
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-morphism sticky top-0 z-50 border-b border-dark-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-semibold tracking-tight text-white">SneakerShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
            >
              Accueil
            </Link>
            <Link 
              href="/#products" 
              className="px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
            >
              Produits
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-2 text-primary-400 hover:text-primary-300 hover:bg-dark-elevated rounded-lg transition-all duration-200 font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right section - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-dark-text-secondary">
                  Bonjour, <span className="text-white font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-2 px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            )}

            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-dark-elevated rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-border/50 animate-fade-in-up">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/#products"
                className="px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produits
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-3 text-primary-400 hover:text-primary-300 hover:bg-dark-elevated rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 text-sm text-dark-text-secondary border-t border-dark-border/30 mt-2">
                    Connecté en tant que <span className="text-white font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200 text-left"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-elevated rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
