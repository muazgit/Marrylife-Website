"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Menu, X, Sparkles, BookOpen, FileCheck2, Baby } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M27 44C13 33 6 23 12 14c5-7 14-4 15 4 1-8 10-11 15-4 6 9-1 19-15 30z"
        fill="currentColor"
      />
      <path
        d="M12 18C6 13 5 7 9 4c3-2 8-1 8 3 0-4 5-5 8-3 4 3 3 9-3 14-2 2-4 3-5 3s-3-1-5-3z"
        fill="var(--color-brand-pink)"
      />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
      <HeartMark className="h-8 w-8 sm:h-9 sm:w-9 text-brand transition-transform group-hover:scale-105" />
      <span className="text-xl sm:text-2xl font-bold leading-none tracking-tight">
        <span className={light ? "text-card" : "text-brand"}>Marry</span>
        <span className="text-brand-pink">Life</span>
      </span>
    </Link>
  );
}

const NAV_LINKS = [
  { label: "হোম", href: "/", active: true },
  { label: "বায়োডাটা", href: "/biodatas" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "জিজ্ঞাসা", href: "/faq" },
  { label: "নির্দেশনা", href: "/guide" },
  { label: "যোগাযোগ", href: "/contact" },
];

const SERVICES = [
  {
    title: "বিবাহ ব্যানার",
    href: "/services/banner",
    icon: Sparkles,
    desc: "সুদৃশ্য ইসলামিক বিয়ের ব্যানার",
  },
  {
    title: "হেলথ ডিরেক্টরি",
    href: "/services/health",
    icon: FileCheck2,
    desc: "স্বাস্থ্য ও বিবাহপূর্ব পরামর্শ",
  },
  {
    title: "চিঠি ও পরামর্শ",
    href: "/services/letters",
    icon: BookOpen,
    desc: "দ্বীনি দাম্পত্য জীবনের গাইড",
  },
  {
    title: "মুসলিম বেবি নেম",
    href: "/services/baby-names",
    icon: Baby,
    desc: "অর্থপূর্ণ ইসলামিক নামের তালিকা",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "font-semibold text-brand-pink"
                    : "text-foreground/80 transition-colors hover:text-brand-pink"
                }
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 outline-none transition-colors hover:text-brand-pink cursor-pointer">
                সেবাসমূহ <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 bg-card border-border shadow-lg rounded-xl"
              >
                {SERVICES.map((s) => (
                  <DropdownMenuItem
                    key={s.title}
                    asChild
                    className="cursor-pointer rounded-lg p-2.5"
                  >
                    <Link href={s.href} className="flex items-start gap-3">
                      <s.icon className="h-4 w-4 mt-0.5 text-brand" />
                      <div>
                        <div className="font-semibold text-sm text-foreground">{s.title}</div>
                        <div className="text-[12px] text-muted-foreground">{s.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions: Language, Login & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand-pink px-2 py-1 rounded-md"
            >
              <Globe className="h-4 w-4" /> ENG
            </button>

            <Link
              href="/login"
              className="rounded-lg bg-brand px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:shadow active:scale-95"
            >
              লগইন
            </Link>

            {/* Mobile Menu Toggle Button (No border, no bg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden flex items-center justify-center p-2 text-foreground/80 hover:text-brand-pink transition-colors cursor-pointer select-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-brand-pink" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation (Rendered inside header) */}
        {mobileMenuOpen && (
          <div
            id="mobile-drawer"
            className="border-t border-border/60 bg-card px-4 pt-3 pb-6 shadow-2xl lg:hidden animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3 max-w-lg mx-auto">
              {/* Navigation links */}
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      link.active
                        ? "bg-brand/10 text-brand-pink font-bold"
                        : "text-foreground/85 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{link.label}</span>
                    <i className="ri-arrow-right-s-line text-muted-foreground text-base" />
                  </Link>
                ))}
              </div>

              {/* Services Section */}
              <div className="pt-2 border-t border-border/50">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  দ্বীনি সেবাসমূহ
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                    >
                      <s.icon className="h-4 w-4 text-brand shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground font-medium">ভাষা / Language</span>
                <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-bold">
                  <span className="rounded-md bg-card px-2.5 py-1 text-brand shadow-xs">বাংলা</span>
                  <span className="px-2.5 py-1 text-muted-foreground hover:text-foreground cursor-pointer">
                    ENG
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Link
                  href="/biodata/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-pink py-3 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-pink/90 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  বিনামূল্যে বায়োডাটা তৈরি করুন
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
