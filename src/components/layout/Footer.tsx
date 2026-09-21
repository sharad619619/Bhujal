'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-stone-300 lg:pb-0 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                AquaShield
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              {t.brand.fullName}
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.platform}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/dashboard', label: t.nav.dashboard },
                { href: '/map', label: t.nav.map },
                { href: '/water-safety', label: t.nav.waterSafety },
                { href: '/remediation', label: t.nav.remediation },
                { href: '/evidence', label: t.nav.evidence },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.community}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/reports/new', label: t.footer.reportIssue },
                { href: '/water-safety', label: t.footer.findWater },
                { href: '/about', label: t.footer.resources },
                { href: '/about', label: t.footer.help },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.research}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/data-sources', label: t.footer.dataMethodology },
                { href: '/about', label: t.footer.modelDocs },
                { href: '/data-sources', label: t.footer.sources },
                { href: '/about', label: t.footer.api, external: true },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">{t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            {[
              { href: '/privacy', label: t.footer.privacy },
              { href: '/terms', label: t.footer.terms },
              { href: '/accessibility', label: t.footer.accessibility },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-stone-500 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
