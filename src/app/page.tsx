"use client";

import Link from "next/link";
import { Navbar, Logo } from "@/components/navbar";
import { HeroSearch } from "@/components/hero-search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative bg-[url('/brand/marrylife-hero-bg.svg')] bg-cover bg-top bg-no-repeat pt-8 pb-12 sm:pt-16 sm:pb-16 md:pt-24 md:pb-24">
      <div className="relative z-10 mx-auto max-w-5xl px-3 sm:px-6 text-center">
        {/* Halal Badge */}
        <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full bg-brand/10 border border-brand/25 px-3.5 py-1 text-[11px] sm:text-xs md:text-sm font-semibold text-brand mb-4 sm:mb-6 shadow-2xs leading-normal text-balance">
          <i className="ri-sparkling-2-fill text-brand-pink text-xs sm:text-sm shrink-0" />
          <span>নির্ভরযোগ্য ও সম্পূর্ণ শরিয়াহ সম্মত ইসলামিক বৈবাহিক মাধ্যম</span>
        </div>

        <h1 className="mb-3 sm:mb-4 text-[32px] sm:text-4xl md:text-5xl lg:text-[58px] font-extrabold leading-[1.2] tracking-tight text-brand text-balance">
          <span className="mb-1 inline-block">দ্বীনি বন্ধনে গড়ে তুলুন</span>
          <br />
          <span className="text-brand-pink">আপনার আদর্শ পরিবার</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-foreground/75 leading-relaxed text-balance px-2">
          পছন্দের এলাকা ও দ্বীনি বৈশিষ্ট্যের ভিত্তিতে খুঁজুন খাঁটি পাত্র-পাত্রীর বায়োডাটা —
          অভিভাবকের প্রত্যক্ষ তত্ত্বাবধানে, সম্পূর্ণ বিনামূল্যে ও গোপনীয়তার সাথে।
        </p>

        {/* MarryLife 4-Column Search Box */}
        <HeroSearch />
      </div>
    </section>
  );
}

/* ------------------------------ create biodata ----------------------------- */

function CreateBiodata() {
  return (
    <section className="bg-card py-10 sm:py-16 md:py-20 text-center border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-3 sm:mb-4 text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
          <span className="text-brand-pink">MarryLife</span>-এ মাত্র কয়েক মিনিটেই তৈরি করুন আপনার
          বায়োডাটা
        </h2>
        <p className="mb-6 sm:mb-8 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          দ্বীনি পরিবারসমূহের কাছে আপনার দ্বীনি বৈশিষ্ট্য, পারিবারিক মর্যাদা ও প্রত্যাশা পৌঁছে দিন
          নিরাপদ ও বিশ্বস্ত মাধ্যমে। বায়োডাটা প্রকাশ সম্পূর্ণ ফ্রি।
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/biodata/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 sm:px-7 py-3 text-sm sm:text-base font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:shadow active:scale-95"
          >
            <i className="ri-add-circle-fill text-lg leading-none" /> বিনামূল্যে বায়োডাটা তৈরি করুন
          </Link>
          <a
            href="https://youtu.be/p8vnL52wZlk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 sm:px-7 py-3 text-sm sm:text-base font-bold text-foreground shadow-2xs transition-colors hover:bg-muted"
          >
            <i className="ri-play-circle-fill text-red-500 text-lg leading-none" /> কীভাবে বায়োডাটা
            সাজাবেন?
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- stats ---------------------------------- */

const STATS = [
  {
    iconClass: "ri-team-fill",
    colorClass:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white",
    label: "সর্বমোট নিবন্ধিত বায়োডাটা",
    value: "৮৭৫০+",
    desc: "যাচাইকৃত দ্বীনদার পাত্র-পাত্রী",
  },
  {
    iconClass: "ri-user-star-fill",
    colorClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white",
    label: "দ্বীনদার পাত্রের বায়োডাটা",
    value: "৪২০০+",
    desc: "প্র্যাকটিসিং মুসলিম ভাই",
  },
  {
    iconClass: "ri-user-heart-fill",
    colorClass:
      "bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white",
    label: "পর্দানশীন পাত্রীর বায়োডাটা",
    value: "৪৫৫০+",
    desc: "দ্বীনদার পর্দানশীন বোন",
  },
  {
    iconClass: "ri-hand-heart-fill",
    colorClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    label: "সফল সুন্নতি বিবাহ",
    value: "১৪২০+",
    desc: "আমাদের মাধ্যমে সম্পন্ন বিয়ে",
  },
];

function Stats() {
  return (
    <section className="bg-lavender py-10 sm:py-16 md:py-20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
            <span className="text-brand-pink">MarryLife</span> পরিবারের সমৃদ্ধ পথচলা
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            আলহামদুলিল্লাহ, প্রতিদিন শত শত দ্বীনদার পরিবার সুন্নতি বৈবাহিক সম্পর্কের সন্ধানে আমাদের
            ওপর আস্থা রাখছেন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-card border border-gray-100 dark:border-border/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg p-3.5 sm:p-6 lg:p-8 text-center group flex flex-col items-center justify-center"
            >
              <span
                className={`mx-auto mb-2.5 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-xl ${stat.colorClass} transition-all duration-300 group-hover:scale-110 shadow-xs shrink-0`}
              >
                <i className={`${stat.iconClass} text-2xl sm:text-3xl lg:text-4xl leading-none`} />
              </span>
              <p className="mb-1 sm:mb-2 text-[11px] sm:text-xs lg:text-[13px] font-bold text-brand line-clamp-1">
                {stat.label}
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
                {stat.desc}
              </p>
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
    step: "০১",
    iconClass: "ri-file-user-fill",
    title: "বায়োডাটা প্রকাশ করুন",
    desc: "আপনার দ্বীনি বৈশিষ্ট্য, পারিবারিক ও শিক্ষাগত তথ্য দিয়ে কয়েক মিনিটে বিনামূল্যে বায়োডাটা তৈরি করুন।",
  },
  {
    step: "০২",
    iconClass: "ri-search-eye-fill",
    title: "পছন্দের বায়োডাটা খুঁজুন",
    desc: "বিভাগ, বয়স, পেশা ও দ্বীনি অভ্যাসের ওপর ভিত্তি করে মানানসই প্রোফাইল ফিল্টার ও পর্যালোচনা করুন।",
  },
  {
    step: "০৩",
    iconClass: "ri-parent-fill",
    title: "অভিভাবকের সম্মতি ও যোগাযোগ",
    desc: "পাত্র-পাত্রী পছন্দ হলে সরাসরি অভিভাবকদের মাধ্যমে যোগাযোগের সংযোগ স্থাপন ও বোঝাপড়া করুন।",
  },
  {
    step: "০৪",
    iconClass: "ri-heart-add-fill",
    title: "সুন্নতি বিবাহ সম্পন্ন",
    desc: "খোঁজ-খবর ও শরিয়াহ সম্মত পরিচয়ের পর দুই পরিবারের সম্মতিতে বরকতময় সুন্নতি বিবাহ সম্পন্ন করুন।",
  },
];

function HowItWorks() {
  return (
    <section className="bg-card py-10 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
            <span className="text-brand-pink">MarryLife</span> যেভাবে আপনাকে সাহায্য করে
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            সহজ, মর্যাদাপূর্ণ ও ইসলামিক নীতিতে ৪টি ধাপে সম্পন্ন করুন আপনার কাঙ্ক্ষিত জীবনসঙ্গী
            খোঁজার যাত্রা
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="relative rounded-xl bg-card border border-gray-100 dark:border-border/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg group p-5 sm:p-6 lg:p-8 text-center"
            >
              {/* Step indicator: All Bengali, bigger font with subtle opacity */}
              <span className="absolute top-3.5 right-4 sm:top-4 sm:right-5 text-xl sm:text-2xl lg:text-3xl font-black text-brand/20 group-hover:text-brand/35 transition-colors select-none tracking-tight">
                ধাপ {step.step}
              </span>

              {/* Linking line between cards without arrow (desktop only) */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`${
                    idx === 1 ? "hidden lg:flex" : "hidden sm:flex"
                  } items-center justify-center absolute top-1/2 -right-6 w-6 -translate-y-1/2 z-20 pointer-events-none`}
                  aria-hidden="true"
                >
                  <div className="w-full border-t-2 border-dashed border-brand/35" />
                </div>
              )}

              <span className="mx-auto mb-3 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <i className={`${step.iconClass} text-2xl leading-none`} />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- why marrylife ----------------------------- */

const FEATURES = [
  {
    iconClass: "ri-shield-check-fill",
    title: "১০০% শরিয়াহ অনুসারী",
    desc: "জনসম্মুখে কোনো ছবি প্রদর্শন করা হয় না। বেগানা নারী-পুরুষের সরাসরি মেলামেশা বা চ্যাটিংয়ের কোনো সুযোগ নেই।",
  },
  {
    iconClass: "ri-user-shared-2-fill",
    title: "ওয়ালী ও অভিভাবকের প্রাধান্য",
    desc: "পরিবারের অভিভাবককে কেন্দ্রে রেখে প্রতিটি সংযোগ প্রতিষ্ঠিত হয়; ওয়ালী ও পরিবারের সন্তুষ্টিই প্রথম অগ্রাধিকার।",
  },
  {
    iconClass: "ri-lock-password-fill",
    title: "সর্বোচ্চ তথ্য আমানতদারিতা",
    desc: "অভিভাবকের সম্মতি ও ভেরিফিকেশন ব্যতীত ব্যক্তিগত মোবাইল বা ঠিকানা কখনোই কোনো তৃতীয় পক্ষের কাছে প্রকাশিত হয় না।",
  },
  {
    iconClass: "ri-gift-fill",
    title: "বিনামূল্যে সার্বিক খেদমত",
    desc: "উম্মাহর সেবায় আদর্শ পরিবার গঠনের সহায়ক হিসেবে বায়োডাটা তৈরি, প্রদর্শন ও সার্চ সম্পূর্ণ বিনামূল্যে উন্মুক্ত।",
  },
];

function WhyMarryLife() {
  return (
    <section className="bg-lavender py-10 sm:py-16 md:py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
            কেন <span className="text-brand-pink">MarryLife</span> অনন্য ও বিশ্বস্ত?
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            ইসলামিক মূল্যবোধ ও তথ্যের আমানতদারিতা রক্ষায় আমাদের আপসহীন প্রতিশ্রুতি
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-start rounded-xl bg-card border border-gray-100 dark:border-border/60 p-5 sm:p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand/30 group"
            >
              <div className="mb-3.5 sm:mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <i className={`${feature.iconClass} text-xl sm:text-2xl leading-none`} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- faq ----------------------------------- */

const FAQS = [
  {
    q: "MarryLife-এ বায়োডাটা তৈরি করতে কি কোনো ফি দিতে হয়?",
    a: "না, MarryLife-এ বায়োডাটা তৈরি করা, প্রকাশ করা এবং অন্য পাত্র-পাত্রীর বায়োডাটা সার্চ করা সম্পূর্ণ বিনামূল্যে। আমরা দ্বীনি খেদমতের অংশ হিসেবে এই প্ল্যাটফর্ম পরিচালনা করছি।",
  },
  {
    q: "ওয়েবসাইটে পাত্র বা পাত্রীর ছবি কেন দেখা যায় না?",
    a: "ইসলামিক শরিয়াহ মতে বেগানা নারী ও পুরুষের ছবি সর্বসাধারণের জন্য উন্মুক্ত রাখা নিষিদ্ধ। তাই আমরা সম্পূর্ণ শরিয়াহ নীতি রক্ষা করে কোনো ছবি জনসম্মুখে প্রকাশ করি না। বায়োডাটা ও পারিবারিক তথ্য পছন্দ হলে উভয় পক্ষের অভিভাবক সরাসরি সাক্ষাতে দেখতে পারেন।",
  },
  {
    q: "পাত্র বা পাত্রী কি নিজেদের মধ্যে সরাসরি চ্যাটিং করতে পারে?",
    a: "না, কোনো অবস্থাতেই সরাসরি ছেলে-মেয়ের মেসেজিং বা চ্যাটিংয়ের সুযোগ নেই। পছন্দ হলে যোগাযোগের অনুরোধ সরাসরি অভিভাবকের কাছে পৌঁছায় এবং কথা শুরু হয় অভিভাবক মারফত।",
  },
  {
    q: "আমার মোবাইল নম্বর বা যোগাযোগের ঠিকানা কি সবাই দেখতে পাবে?",
    a: "না। আপনার নাম, মোবাইল নম্বর বা পিতা-মাতার যোগাযোগের তথ্য সাধারণ দর্শনার্থীদের জন্য সম্পূর্ণ গোপন থাকে। কোনো পরিবার বায়োডাটা দেখে আবেদন করলে এবং আপনি সম্মতি দিলে তবেই যোগাযোগ তথ্য প্রকাশিত হয়।",
  },
  {
    q: "বায়োডাটা কীভাবে ডিলিট বা সাময়িক লুকিয়ে রাখব?",
    a: "আপনার একাউন্টে লগইন করে ড্যাশবোর্ড থেকে যেকোনো সময় এক ক্লিকেই বায়োডাটা সাময়িক নিষ্ক্রিয় (Hide) অথবা স্থায়ীভাবে ডিলিট করতে পারবেন।",
  },
];

function FAQ() {
  return (
    <section className="bg-lavender py-10 sm:py-16 md:py-20 border-t border-border/40">
      <div className="mx-auto max-w-4xl px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
            সচরাচর জিজ্ঞাসিত <span className="text-brand-pink">প্রশ্ন ও সমাধান</span>
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            MarryLife প্ল্যাটফর্ম ব্যবহার সম্পর্কিত সর্বাধিক পরিচিত প্রশ্নের নির্ভরযোগ্য উত্তর
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2.5 sm:space-y-3">
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="rounded-lg border border-gray-100 dark:border-border/60 bg-card px-4 sm:px-5 shadow-2xs"
            >
              <AccordionTrigger className="text-left text-xs sm:text-sm md:text-base font-semibold text-foreground hover:no-underline py-3.5 sm:py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-3.5 sm:pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------------------------------- footer --------------------------------- */

function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-4 text-xs sm:text-sm text-footer-foreground/80 leading-relaxed max-w-sm">
              MarryLife একটি নির্ভরযোগ্য ইসলামিক বিবাহ প্ল্যাটফর্ম, যেখানে দ্বীনদার পাত্র-পাত্রীগণ
              পারিবারিক মর্যাদায় উপযুক্ত জীবনসঙ্গী খুঁজে নিতে পারেন।
            </p>
            <p className="mt-3 text-xs text-footer-foreground/70">
              ইমেইল যোগাযোগ:{" "}
              <a href="mailto:support@marrylife.com" className="text-brand-pink hover:underline">
                support@marrylife.com
              </a>
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/10 text-card hover:bg-card/20 transition-colors"
                aria-label="Facebook"
              >
                <i className="ri-facebook-circle-fill text-lg" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/10 text-card hover:bg-card/20 transition-colors"
                aria-label="YouTube"
              >
                <i className="ri-youtube-fill text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/10 text-card hover:bg-card/20 transition-colors"
                aria-label="Instagram"
              >
                <i className="ri-instagram-fill text-lg" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-card mb-3 sm:mb-4">প্রয়োজনীয় লিংক</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-footer-foreground/80">
              <li>
                <Link href="/biodatas" className="hover:text-brand-pink transition-colors">
                  » সকল বায়োডাটা দেখুন
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-pink transition-colors">
                  » আমাদের লক্ষ্য
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-pink transition-colors">
                  » জিজ্ঞাসা (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-brand-pink transition-colors">
                  » ব্যবহার নির্দেশিকা
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-pink transition-colors">
                  » যোগাযোগ ও সহায়তা
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-card mb-3 sm:mb-4">দ্বীনি সেবাসমূহ</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-footer-foreground/80">
              <li>
                <Link href="/services/banner" className="hover:text-brand-pink transition-colors">
                  » বিবাহ ব্যানার ডিজাইন
                </Link>
              </li>
              <li>
                <Link href="/services/health" className="hover:text-brand-pink transition-colors">
                  » বিবাহপূর্ব স্বাস্থ্য গাইড
                </Link>
              </li>
              <li>
                <Link href="/services/letters" className="hover:text-brand-pink transition-colors">
                  » দাম্পত্য জীবনের চিঠি
                </Link>
              </li>
              <li>
                <Link
                  href="/services/baby-names"
                  className="hover:text-brand-pink transition-colors"
                >
                  » ইসলামিক শিশুর নাম ডিরেক্টরি
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-bold text-card mb-3 sm:mb-4">পলিসি ও শর্তাবলী</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-footer-foreground/80">
              <li>
                <Link href="/privacy" className="hover:text-brand-pink transition-colors">
                  গোপনীয়তা নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-pink transition-colors">
                  শর্তাবলী ও নিয়ম
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-brand-pink transition-colors">
                  রিফান্ড ও সততা পলিসি
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-brand-pink transition-colors">
                  তথ্য নিরাপত্তা প্রতিশ্রুতি
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-footer-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-foreground/60 text-center sm:text-left">
          <p>© ২০২৬ MarryLife.com সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5">
            <i className="ri-checkbox-circle-fill text-emerald-400 text-sm" /> সম্পূর্ণ শরীয়াহ
            নীতিমালা মোতাবেক পরিচালিত
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ floating messenger -------------------------- */

function FloatingMessenger() {
  return (
    <a
      href="https://m.me/marrylife"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Messenger Support"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-messenger text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
    >
      <i className="ri-messenger-fill text-2xl sm:text-3xl leading-none" />
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CreateBiodata />
        <Stats />
        <HowItWorks />
        <WhyMarryLife />
        <FAQ />
      </main>
      <Footer />
      <FloatingMessenger />
    </div>
  );
}
