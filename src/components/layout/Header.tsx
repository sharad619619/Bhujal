'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { db, SearchResultItem } from '@/lib/db/store';
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
  ArrowRight,
  School,
  Building,
  FileText,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', labelHi: 'सिंहावलोकन', icon: Layers },
  { href: '/map', label: 'Subsurface Map', labelHi: 'भूजल मानचित्र', icon: Map },
  { href: '/dashboard', label: 'Console', labelHi: 'कंसोल', icon: LayoutDashboard },
  { href: '/villages', label: 'Communities', labelHi: 'समुदाय', icon: Users },
  { href: '/water-safety', label: 'Water Safety', labelHi: 'जल सुरक्षा', icon: Droplets },
  { href: '/remediation', label: 'Remediation', labelHi: 'उपचार योजना', icon: Sprout },
  { href: '/data-sources', label: 'Data Center', labelHi: 'डेटा केंद्र', icon: Database },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSampleMode, setIsSampleMode] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useTranslation();

  const isHindi = language === 'hi';

  // Check sample mode
  useEffect(() => {
    setIsSampleMode(db.isSampleMode());
  }, [pathname]);

  // Handle keyboard shortcuts (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSelectedIndex(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle search queries
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = db.globalSearch(searchQuery);
      setSearchResults(results);
      setSearchOpen(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchQuery]);

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      if (target) {
        router.push(target.href);
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

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
        className="w-full bg-[#ba1a1a] text-white py-1.5 px-4 lg:px-8 flex items-center justify-between shadow-xs z-50 text-xs font-medium"
      >
        <div className="max-w-[1536px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span className="font-bold tracking-wide uppercase">
              🚨 {isHindi ? 'रानिया सेक्टर आपातकालीन सलाह:' : 'Rania Sector Water Advisory:'}
            </span>
            <span className="hidden sm:inline">
              {isHindi
                ? '4 हैंडपंप अत्यधिक दूषित पाए गए — तत्काल शुद्ध पेयजल केंद्र पर जाएँ'
                : '4 Hand Pumps Flagged as Contaminated — Safe Solar Borewell DW-02 active'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isSampleMode && (
              <span className="text-[10px] font-mono uppercase bg-black/30 px-2 py-0.5 rounded text-emerald-200 border border-emerald-400/30">
                DEMO WORKSPACE
              </span>
            )}
            <span className="text-[10px] font-mono uppercase bg-black/25 px-2 py-0.5 rounded text-white/95">
              UPPCB ALERT #24-09A
            </span>
            <Link
              href="/water-safety"
              className="text-[11px] underline font-semibold text-white hover:text-white/80 transition-colors whitespace-nowrap"
            >
              {isHindi ? 'जाँच करें →' : 'Verify Safety →'}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Top Navigation Bar */}
      <header className="bg-[#12372A]/95 text-white backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all">
        <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-2.5 flex justify-between items-center gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shadow-inner">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-tight font-bold text-white flex items-center gap-1.5">
                  Bhujal AI
                  <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-normal">
                    v2.4
                  </span>
                </span>
              </div>
            </Link>

            {/* Quick Basins Search Bar with Global Autocomplete Dropdown */}
            <div ref={searchContainerRef} className="relative hidden xl:block w-72">
              <div className="flex items-center gap-2 bg-white/5 border border-white/15 hover:border-white/30 focus-within:border-emerald-400 rounded-lg px-3 py-1.5 transition-all">
                <Search className="w-3.5 h-3.5 text-white/50 shrink-0" />
                <input
                  ref={searchInputRef}
                  className="bg-transparent border-0 p-0 text-xs text-white placeholder:text-white/40 focus:ring-0 w-full outline-none"
                  placeholder={
                    isHindi
                      ? 'हैंडपंप, गाँव या रिपोर्ट खोजें...'
                      : 'Search handpump, village or report...'
                  }
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setSearchOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
                <kbd className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/60 shrink-0">
                  ⌘K
                </kbd>
              </div>

              {/* Autocomplete Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#002116] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/10 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-white/50 uppercase tracking-wider bg-white/5">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((item, idx) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={cn(
                        'block px-3 py-2.5 transition-colors',
                        selectedIndex === idx
                          ? 'bg-emerald-500/20 text-white'
                          : 'hover:bg-white/10 text-white/90'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              'text-[9px] font-mono uppercase px-1.5 py-0.5 rounded',
                              item.badge === 'SAFE'
                                ? 'bg-emerald-500/30 text-emerald-300'
                                : item.badge === 'HAZARDOUS'
                                ? 'bg-red-500/30 text-red-300'
                                : 'bg-white/10 text-white/70'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-white/60 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links — Uniform Single-Line Layout */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[11px] xl:text-xs font-semibold tracking-wide uppercase text-white/80 shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors py-1 whitespace-nowrap',
                  isActive(item.href)
                    ? 'text-emerald-300 border-b-2 border-emerald-400 font-bold'
                    : 'hover:text-emerald-300'
                )}
              >
                {isHindi ? item.labelHi : item.label}
              </Link>
            ))}
          </nav>

          {/* Trailing Actions: Bilingual Switcher, Console Button, Mobile Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isHindi ? 'हिंदी | EN' : 'EN | हिंदी'}</span>
            </button>

            {/* Primary Action Button */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-[#002116] font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>{isHindi ? 'कंसोल खोलें' : 'Launch Console'}</span>
            </Link>

            {/* Officer Avatar Badge */}
            <div
              className="hidden 2xl:flex items-center gap-2 pl-2 border-l border-white/15"
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
            {/* Mobile Search */}
            <div className="mb-3">
              <input
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/50 outline-none"
                placeholder={isHindi ? 'हैंडपंप या गाँव खोजें...' : 'Search handpump or village...'}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
                  <span>{isHindi ? item.labelHi : item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                href="/reports/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-lg text-xs font-bold text-center"
              >
                {isHindi ? 'समस्या दर्ज करें' : 'Report Issue'}
              </Link>
              <Link
                href="/water-safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-emerald-400 text-[#002116] px-3 py-2 rounded-lg text-xs font-bold text-center"
              >
                {isHindi ? 'जल सुरक्षा जाँचें' : 'Check Water Point'}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
