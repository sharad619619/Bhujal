'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Bell,
  Globe,
  Home,
  Map,
  AlertTriangle,
  Droplets,
  MoreHorizontal,
  Shield,
  ChevronDown,
  Search,
  User,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', labelKey: 'dashboard' as const },
  { href: '/map', labelKey: 'map' as const },
  { href: '/villages', labelKey: 'communities' as const },
  { href: '/water-safety', labelKey: 'waterSafety' as const },
  { href: '/remediation', labelKey: 'remediation' as const },
  { href: '/reports', labelKey: 'reports' as const },
  { href: '/evidence', labelKey: 'evidence' as const },
  { href: '/about', labelKey: 'about' as const },
];

const mobileBottomLinks = [
  { href: '/dashboard', labelKey: 'home' as const, icon: Home },
  { href: '/map', labelKey: 'map' as const, icon: Map },
  { href: '/reports/new', labelKey: 'report' as const, icon: AlertTriangle },
  { href: '/water-safety', labelKey: 'water' as const, icon: Droplets },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useTranslation();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-green-900 tracking-tight">
                  AquaShield
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(link.href)
                      ? 'text-green-800 bg-green-50'
                      : 'text-stone-600 hover:text-green-800 hover:bg-stone-50'
                  )}
                >
                  {t.nav[link.labelKey]}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search (desktop) */}
              <button
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-stone-400 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors w-48 lg:w-56"
                aria-label={t.nav.search}
              >
                <Search className="w-4 h-4" />
                <span className="truncate">{t.nav.search}</span>
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 text-stone-500 hover:text-green-800 hover:bg-stone-50 rounded-lg transition-colors"
                aria-label={t.nav.notifications}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-stone-600 hover:text-green-800 hover:bg-stone-50 rounded-lg transition-colors"
                aria-label={t.nav.language}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'EN'}</span>
              </button>

              {/* User Avatar */}
              <button className="hidden sm:flex items-center gap-1 p-1.5 hover:bg-stone-50 rounded-lg transition-colors">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-800" />
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-600 hover:text-green-800 hover:bg-stone-50 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white">
            <nav className="max-w-[1440px] mx-auto px-4 py-3 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-xl transition-colors',
                    isActive(link.href)
                      ? 'text-green-800 bg-green-50'
                      : 'text-stone-600 hover:text-green-800 hover:bg-stone-50'
                  )}
                >
                  {t.nav[link.labelKey]}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-lg"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileBottomLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 min-w-[60px] rounded-lg transition-colors',
                  isActive(link.href)
                    ? 'text-green-800'
                    : 'text-stone-400 hover:text-green-800'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{t.nav[link.labelKey]}</span>
              </Link>
            );
          })}
          <button
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[60px] rounded-lg text-stone-400 hover:text-green-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs font-medium">{t.nav.more}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
