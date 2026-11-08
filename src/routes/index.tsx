import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Search,
  Moon,
  Globe,
  Plus,
  Youtube,
  Smartphone,
  UserPlus,
  Phone,
  MessagesSquare,
  Mail,
  ShieldCheck,
  FileText,
  RotateCcw,
  Facebook,
  Instagram,
  Play,
  UsersRound,
  UserRound,
  Venus,
  HeartHandshake,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarryLife | দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "আপনার পছন্দের এলাকার দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন ও তৈরি করুন — সম্পূর্ণ বিনামূল্যে।",
      },
      { property: "og:title", content: "MarryLife | দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "আপনার পছন্দের এলাকার দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন ও তৈরি করুন — সম্পূর্ণ বিনামূল্যে।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------------------------------- logo ---------------------------------- */

function HeartMark({ className }: { className?: string }) {
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

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-2">
      <HeartMark className="h-9 w-9 text-brand" />
      <span className="text-2xl font-bold leading-none">
        <span className={light ? "text-card" : "text-brand"}>Marry</span>
        <span className="text-brand-pink">Life</span>
      </span>
    </a>
  );
}

/* --------------------------------- header --------------------------------- */

const NAV_LINKS = [
  { label: "হোম", href: "#", active: true },
  { label: "বায়োডাটা", href: "#" },
  { label: "আমাদের সম্পর্কে", href: "#" },
  { label: "জিজ্ঞাসা", href: "#" },
  { label: "নির্দেশনা", href: "#" },
  { label: "যোগাযোগ", href: "#" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "font-semibold text-brand-pink"
                  : "text-foreground/80 transition-colors hover:text-brand-pink"
              }
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="flex items-center gap-1 text-foreground/80 transition-colors hover:text-brand-pink"
          >
            সেবাসমূহ <ChevronDown className="h-4 w-4" />
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            aria-label="থিম পরিবর্তন"
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Moon className="h-5 w-5" />
          </button>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand-pink"
          >
            <Globe className="h-4.5 w-4.5" /> ENG
          </a>
          <a
            href="#"
            className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
          >
            লগইন
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function SearchField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-input bg-muted/40 px-4 py-2.5 text-[15px] text-foreground/80 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring/30">
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-24 text-center sm:pt-20">
        <h1 className="text-5xl leading-tight font-bold sm:text-6xl">
          <span className="text-foreground">খুঁজে নিন আপনার দ্বীনদার</span>
          <span className="mt-1 block text-brand-pink">জীবনসঙ্গী</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/85">
          আপনার পছন্দের এলাকার দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন, মানানসই
          হলে অভিভাবকের সাথে যোগাযোগ করুন — পুরোটাই বিনামূল্যে।
        </p>
        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-4 rounded-2xl bg-card p-6 text-start shadow-xl shadow-brand/10 sm:flex-row sm:items-end">
          <SearchField label="আমি খুঁজছি" options={["সবগুলো"]} />
          <SearchField label="বৈবাহিক অবস্থা" options={["সবগুলো"]} />
          <SearchField
            label="স্থায়ী ঠিকানা"
            options={["দেশ নির্বাচন করুন"]}
          />
          <a
            href="#"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold whitespace-nowrap text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
          >
            <Search className="h-4.5 w-4.5" /> বায়োডাটা খুঁজুন
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ create biodata ----------------------------- */

function CreateBiodata() {
  return (
    <section className="bg-card py-16 text-center sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold sm:text-4xl">
          <span className="text-brand-pink">MarryLife</span>{" "}
          <span className="text-foreground">
            এ কয়েক মিনিটেই তৈরি করুন নিজের বায়োডাটা
          </span>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-[15px] font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
          >
            <Plus className="h-4.5 w-4.5" /> বায়োডাটা তৈরি করুন
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-7 py-3.5 text-[15px] font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Youtube className="h-5 w-5 text-brand" /> কীভাবে তৈরি করবেন,
            দেখে নিন
          </a>
        </div>
        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl bg-lavender px-7 py-6 text-start shadow-sm sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              MarryLife অ্যান্ড্রয়েড অ্যাপ
            </h3>
            <p className="mt-1 text-foreground/75">
              মোবাইলে খোঁজার সবচেয়ে সহজ উপায় — এখনই ডাউনলোড করুন
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
          >
            <Smartphone className="h-4.5 w-4.5" /> অ্যাপ ডাউনলোড করুন
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- stats ---------------------------------- */

const STATS = [
  {
    icon: UsersRound,
    label: "মোট নিবন্ধিত বায়োডাটা",
    value: "৯৮৫০",
  },
  { icon: UserRound, label: "পাত্রের বায়োডাটা", value: "৪৫২০" },
  { icon: Venus, label: "পাত্রীর বায়োডাটা", value: "৫৩৩০" },
  { icon: HeartHandshake, label: "সম্পন্ন বিবাহ", value: "১৮৫০+" },
];

function Stats() {
  return (
    <section className="bg-lavender py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
          <span className="text-brand-pink">MarryLife</span> ব্যবহারকারীর
          পরিসংখ্যান
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl bg-card px-6 py-9 text-center shadow-sm"
            >
              <stat.icon className="h-16 w-16 text-brand" />
              <p className="mt-5 text-[15px] font-semibold text-foreground/85">
                {stat.label}
              </p>
              <p className="mt-2 text-4xl font-bold text-brand">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- how it works ------------------------------ */

const STEPS = [
  {
    icon: UserPlus,
    title: "বায়োডাটা তৈরি করুন",
    desc: "মৌলিক ও ব্যক্তিগত তথ্য দিয়ে কয়েক মিনিটেই নিজের বায়োডাটা তৈরি করে ফেলুন — একদম বিনামূল্যে।",
  },
  {
    icon: Search,
    title: "বায়োডাটা খুঁজুন",
    desc: "বয়স, এলাকা, পেশা কিংবা শিক্ষাগত যোগ্যতা — প্রয়োজনমতো ফিল্টার ব্যবহার করে মানানসই পাত্র-পাত্রীর তালিকা বের করুন।",
  },
  {
    icon: Phone,
    title: "যোগাযোগ করুন",
    desc: "পছন্দ হয়ে গেলে অভিভাবকের মাধ্যমেই সরাসরি যোগাযোগ করুন — প্রতিটি ধাপ অভিভাবকের তত্ত্বাবধানে সম্পন্ন হয়।",
  },
  {
    icon: MessagesSquare,
    title: "বিবাহ সম্পন্ন করুন",
    desc: "সব ঠিক থাকলে পরিবারের সম্মতিতে ভালোভাবে খোঁজ-খবর নিয়ে সুন্নতি অনুযায়ী বিবাহ সম্পন্ন করুন।",
  },
];

function HowItWorks() {
  return (
    <section className="bg-card py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
          <span className="text-brand-pink">MarryLife</span> কাজের ধাপগুলো
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl border border-border/70 bg-card px-6 py-9 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender">
                <step.icon className="h-7 w-7 text-brand" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-messenger px-7 py-3.5 text-[15px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Facebook className="h-5 w-5" /> মেসেঞ্জারে আমাদের সাথে কথা বলুন
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- footer ---------------------------------- */

const FOOTER_COLS = [
  {
    title: "প্রয়োজনীয় লিংক",
    links: [
      "সকল বায়োডাটা দেখুন",
      "আমাদের সম্পর্কে",
      "জিজ্ঞাসা",
      "নির্দেশনা",
      "যোগাযোগ",
    ],
  },
  {
    title: "সেবাসমূহ",
    links: ["বিবাহ ব্যানার", "হেলথ ডিরেক্টরি", "চিঠি", "মুসলিম বেবি নেম"],
  },
];

const POLICY_LINKS = [
  { icon: ShieldCheck, label: "গোপনীয়তা নীতি" },
  { icon: FileText, label: "শর্তাবলী ও নীতিমালা" },
  { icon: RotateCcw, label: "রিফান্ড পলিসি" },
];

function Footer() {
  return (
    <footer className="border-t-4 border-brand-pink bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-footer-foreground/80">
            MarryLife একটি অনলাইন ইসলামিক ম্যাট্রিমনি প্ল্যাটফর্ম, যেখানে দ্বীনদার
            পাত্র-পাত্রীরা নিজের পছন্দমতো বায়োডাটা খুঁজে অভিভাবকের মাধ্যমে
            উপযুক্ত জীবনসঙ্গী নির্বাচন করতে পারেন।
          </p>
          <a
            href="mailto:support@marrylife.com"
            className="mt-5 flex items-center gap-2 text-sm text-footer-foreground/90 transition-colors hover:text-brand-pink-soft"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-footer-foreground/10">
              <Mail className="h-4 w-4" />
            </span>
            support@marrylife.com
          </a>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-lg font-semibold text-card">{col.title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-footer-foreground/85 transition-colors hover:text-brand-pink-soft"
                  >
                    <span className="text-brand-pink-soft">»</span> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-lg font-semibold text-card">পলিসি ও শর্তাবলী</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {POLICY_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="flex items-center gap-2 text-footer-foreground/85 transition-colors hover:text-brand-pink-soft"
                >
                  <item.icon className="h-4 w-4 text-brand-pink-soft" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-card">
            অ্যাপ ও সোশ্যাল মিডিয়া
          </h4>
          <p className="mt-4 text-sm text-footer-foreground/85">
            প্লে স্টোর থেকে অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন:
          </p>
          <a
            href="#"
            className="mt-3 flex w-fit items-center gap-3 rounded-lg border border-footer-foreground/25 px-4 py-2 transition-colors hover:bg-footer-foreground/10"
          >
            <Play className="h-6 w-6 fill-current text-card" />
            <span className="leading-tight">
              <span className="block text-[10px] uppercase text-footer-foreground/70">
                Get it on
              </span>
              <span className="block text-base font-semibold text-card">
                Google Play
              </span>
            </span>
          </a>
          <p className="mt-6 text-sm text-footer-foreground/85">
            আমাদের সাথে যুক্ত থাকুন:
          </p>
          <div className="mt-3 flex gap-2.5">
            {[
              { icon: Facebook, href: "#" },
              { icon: Youtube, href: "#" },
              { icon: Instagram, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-footer-foreground/25 transition-colors hover:bg-footer-foreground/10"
              >
                <s.icon className="h-4.5 w-4.5 text-card" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-footer-foreground/15 py-5 text-center text-sm text-footer-foreground/75">
        © ২০২৬ MarryLife.com সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}

/* ---------------------------------- page ----------------------------------- */

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CreateBiodata />
        <Stats />
        <HowItWorks />
      </main>
      <Footer />
      <a
        href="#"
        aria-label="যোগাযোগ করুন"
        className="fixed right-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-messenger text-white shadow-lg transition-transform hover:scale-105"
      >
        <Facebook className="h-6 w-6 fill-current" />
      </a>
    </div>
  );
}
