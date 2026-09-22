'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Search,
  Layers,
  Map,
  LayoutDashboard,
  Users,
  Droplets,
  Sprout,
  Database,
  Languages,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: Layers },
  { href: '/map', label: 'Subsurface Map', icon: Map },
  { href: '/dashboard', label: 'Console', icon: LayoutDashboard },
  { href: '/villages', label: 'Communities', icon: Users },
  { href: '/water-safety', label: 'Water Safety', icon: Droplets },
  { href: '/remediation', label: 'Remediation', icon: Sprout },
  { href: '/data-sources', label: 'Data Center', icon: Database },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { language, setLanguage } = useTranslation();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      {/* Top Advisory Notice Strip */}
      <aside
        aria-label="District Emergency Advisory"
        className="w-full bg-[#ba1a1a] text-white py-1.5 px-4 lg:px-10 flex items-center justify-between shadow-xs z-50 text-xs font-medium"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span className="font-bold tracking-wide uppercase">
              🚨 Rania Sector Water Advisory:
            </span>
            <span className="hidden sm:inline">
              4 Hand Pumps Flagged as Contaminated (रानिया सेक्टर: 4 हैंडपंप अत्यधिक दूषित पाए गए)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase bg-black/25 px-2 py-0.5 rounded text-white/95">
              UPPCB ALERT #24-09A
            </span>
            <Link
              href="/water-safety"
              className="text-[11px] underline font-semibold text-white hover:text-white/80 transition-colors"
            >
              Verify Safety →
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Top Navigation Bar */}
      <header className="bg-[#12372A]/95 text-white backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shadow-inner">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-tight font-bold text-white flex items-center gap-1.5">
                  Bhujal AI
                  <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-normal">
                    v2.4 Telemetry
                  </span>
                </span>
              </div>
            </Link>

            {/* Quick Basins Search Bar */}
            <div className="hidden xl:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-64">
              <Search className="w-4 h-4 text-white/50" />
              <input
                className="bg-transparent border-0 p-0 text-xs text-white placeholder:text-white/40 focus:ring-0 w-full outline-none"
                placeholder="Search aquifer, village or Cr(VI)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wide uppercase text-white/80">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors py-1',
                  isActive(item.href)
                    ? 'text-emerald-300 border-b-2 border-emerald-400 font-bold'
                    : 'hover:text-emerald-300'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Trailing Actions: Bilingual Switcher, Console Button, Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
            </button>

            {/* Primary Action Button */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-[#002116] font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">hub</span>
              <span>Launch Console</span>
            </Link>

            {/* Officer Avatar Badge */}
            <div
              className="hidden md:flex items-center gap-2 pl-2 border-l border-white/15"
              title="Kanpur Dehat Hydro-Geologist Desk"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                KD
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#002116] px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-emerald-400/20 text-emerald-300 font-bold'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                href="/reports/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-lg text-xs font-bold text-center"
              >
                Report Issue (समस्या दर्ज करें)
              </Link>
              <Link
                href="/water-safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-emerald-400 text-[#002116] px-3 py-2 rounded-lg text-xs font-bold text-center"
              >
                Check Water Point
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
