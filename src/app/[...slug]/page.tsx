import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";

interface StaticPageMeta {
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  sections: { heading: string; body: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

const STATIC_PAGES: Record<string, StaticPageMeta> = {
  about: {
    title: "আমাদের সম্পর্কে",
    subtitle: "দ্বীনদার মুসলিমদের জন্য শরীয়াহসম্মত ও বিশ্বস্ত ম্যাট্রিমনি প্ল্যাটফর্ম।",
    badge: "পরিচিতি",
    icon: "ri-Information-line",
    sections: [
      {
        heading: "আমাদের লক্ষ্য ও উদ্দেশ্য",
        body: "MarryLife-এর মূল লক্ষ্য হলো প্র্যাকটিসিং মুসলিম পাত্র-পাত্রী এবং তাঁদের অভিভাবকদের জন্য একটি নিরাপদ, পর্দাশীল ও শরীয়াহসম্মত মাধ্যম তৈরি করা—যেখানে কোনো প্রকাশ্য ছবি বা গায়রে-মাহরাম অবাধ চ্যাটিং ছাড়াই অভিভাবকের তত্ত্বাবধানে বিয়ের প্রস্তাব আদান-প্রদান করা যায়।",
      },
      {
        heading: "কেন আমরা আলাদা?",
        body: "প্রতিটি বায়োডাটা ম্যানুয়ালি যাচাই করা হয় এবং পাত্র-পাত্রী ও অভিভাবকের ব্যক্তিগত ফোন নম্বর কঠোর গোপনীয়তায় সংরক্ষিত থাকে। শুধুমাত্র অভিভাবকের সম্মতি সাপেক্ষে যোগাযোগের তথ্য প্রদান করা হয়।",
      },
    ],
  },
  faq: {
    title: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী",
    subtitle: "MarryLife ব্যবহারের নিয়ম ও শরীয়াহ নীতিমালা সংক্রান্ত সাধারণ প্রশ্নোত্তর।",
    badge: "জিজ্ঞাসা",
    icon: "ri-question-answer-line",
    sections: [
      {
        heading: "বায়োডাটা তৈরি করতে কি কোনো খরচ হয়?",
        body: "না, MarryLife-এ বায়োডাটা তৈরি ও জমা দেওয়া সম্পূর্ণ বিনামূল্যে।",
      },
      {
        heading: "অভিভাবকের অনুমতি ছাড়া কি বায়োডাটা জমা দেওয়া যাবে?",
        body: "না। শরীয়াহ নীতিমালা অনুযায়ী পাত্র-পাত্রীর অভিভাবকের অবগতি ও সম্মতি ছাড়া কোনো বায়োডাটা অনুমোদন করা হয় না।",
      },
    ],
  },
  guide: {
    title: "বায়োডাটা তৈরির নির্দেশনা",
    subtitle: "সঠিকভাবে বায়োডাটা পূরণ ও প্রস্তাব পাঠানোর ধাপসমূহ।",
    badge: "নির্দেশনা",
    icon: "ri-book-open-line",
    sections: [
      {
        heading: "১. সত্য ও স্পষ্ট তথ্য প্রদান",
        body: "শিক্ষাগত যোগ্যতা, পেশা, দ্বীনি অনুশীলন ও পারিবারিক তথ্য সম্পূর্ণ সততার সাথে পূরণ করুন।",
      },
      {
        heading: "২. অভিভাবকের নম্বর যুক্তকরণ",
        body: "যোগাযোগের তথ্যে অবশ্যই পিতা, ভাই বা বৈধ অভিভাবকের সচল মোবাইল নম্বর প্রদান করুন।",
      },
    ],
    ctaLabel: "বায়োডাটা সমূহ দেখুন",
    ctaHref: "/biodatas",
  },
  contact: {
    title: "যোগাযোগ করুন",
    subtitle: "যেকোনো প্রশ্ন, পরামর্শ বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।",
    badge: "সহায়তা",
    icon: "ri-customer-service-2-line",
    sections: [
      {
        heading: "ইমেইল ও সাপোর্ট",
        body: "আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করতে ইমেইল করুন: support@marrylife.com। শনি থেকে বৃহস্পতিবার সকাল ১০টা থেকে রাত ৮টা পর্যন্ত সেবা প্রদান করা হয়।",
      },
    ],
  },
  "services/banner": {
    title: "ইসলামিক বিবাহ ব্যানার",
    subtitle: "সুন্নাহসম্মত ও নান্দনিক ইসলামিক বিয়ের ব্যানার ও কার্ড ডিজাইন সেবা।",
    badge: "দ্বীনি সেবা",
    icon: "ri-Sparkling-line",
    sections: [
      {
        heading: "বিবাহ ব্যানার ও দাওয়াতপত্র",
        body: "জীবনের অন্যতম বরকতময় দিনে শরীয়াহসম্মত দোয়া ও ক্যালিগ্রাফি সম্বলিত ডিজিটাল ও প্রিন্ট ব্যানার সেবা।",
      },
    ],
  },
  "services/health": {
    title: "হেলথ ডিরেক্টরি",
    subtitle: "বিবাহপূর্ব স্বাস্থ্য সচেতনতা ও অভিজ্ঞ চিকিৎসকদের পরামর্শ।",
    badge: "দ্বীনি সেবা",
    icon: "ri-heart-pulse-line",
    sections: [
      {
        heading: "বিবাহপূর্ব স্বাস্থ্য পরীক্ষা ও পরামর্শ",
        body: "সুস্থ ও সুন্দর দাম্পত্য জীবনের জন্য থ্যালাসেমিয়া স্ক্রিনিং ও প্রয়োজনীয় স্বাস্থ্য পরামর্শ নির্দেশিকা।",
      },
    ],
  },
  "services/letters": {
    title: "চিঠি ও দাম্পত্য পরামর্শ",
    subtitle: "কুরআন ও সুন্নাহর আলোকে সুখী দাম্পত্য জীবনের দিকনির্দেশনা।",
    badge: "দ্বীনি সেবা",
    icon: "ri-book-read-line",
    sections: [
      {
        heading: "দ্বীনি দাম্পত্য গাইড",
        body: "স্বামী-স্ত্রীর পারস্পরিক হক, সবর ও রহমতের বন্ধন গড়ে তোলার প্রামাণ্য প্রবন্ধ ও নসিহত।",
      },
    ],
  },
  "services/baby-names": {
    title: "মুসলিম বেবি নেম",
    subtitle: "নবজাতক সন্তানের জন্য সুন্দর ও অর্থপূর্ণ ইসলামিক নামের তালিকা।",
    badge: "দ্বীনি সেবা",
    icon: "ri-emotion-happy-line",
    sections: [
      {
        heading: "অর্থবহ ইসলামিক নাম",
        body: "নবী-রাসূল (আ.), সাহাবায়ে কেরাম ও সালাফদের নামের সাথে সামঞ্জস্যপূর্ণ অর্থসহ নামের সংকলন।",
      },
    ],
  },
  privacy: {
    title: "গোপনীয়তা নীতি (Privacy Policy)",
    subtitle: "আপনার ব্যক্তিগত ও পারিবারিক তথ্যের নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার।",
    badge: "আইনি তথ্য",
    icon: "ri-lock-2-line",
    sections: [
      {
        heading: "তথ্য সুরক্ষা ও গোপনীয়তা",
        body: "পাত্র-পাত্রী এবং অভিভাবকের নাম, মোবাইল নম্বর ও পূর্ণ ঠিকানা কখনোই পাবলিক পেজে প্রকাশ করা হয় না। Row-Level Security (RLS) দ্বারা সকল ব্যক্তিগত তথ্য সুরক্ষিত থাকে।",
      },
    ],
  },
  terms: {
    title: "ব্যবহারের শর্তাবলী (Terms of Service)",
    subtitle: "MarryLife প্ল্যাটফর্ম ব্যবহারের নীতিমালা ও শর্তসমূহ।",
    badge: "আইনি তথ্য",
    icon: "ri-file-list-3-line",
    sections: [
      {
        heading: "শরীয়াহ ও সত্যতা অঙ্গীকার",
        body: "ব্যবহারকারীকে অবশ্যই সত্য তথ্য প্রদান করতে হবে এবং শুধুমাত্র বৈধ বিবাহের উদ্দেশ্যে অভিভাবকের মাধ্যমে যোগাযোগ করতে হবে।",
      },
    ],
  },
  refund: {
    title: "রিফান্ড পলিসি (Refund Policy)",
    subtitle: "কানেকশন বা ক্রেডিট সংক্রান্ত রিফান্ড নীতিমালা।",
    badge: "আইনি তথ্য",
    icon: "ri-refund-2-line",
    sections: [
      {
        heading: "ক্রেডিট ফেরত নীতিমালা",
        body: "প্রস্তাব গৃহীত না হলে বা অভিভাবক যোগাযোগের অনুমতি না দিলে ব্যবহৃত ক্রেডিট অ্যাকাউন্টে পুনরায় ফেরত দেওয়া হয়।",
      },
    ],
  },
  security: {
    title: "নিরাপত্তা নীতিমালা",
    subtitle: "নিরাপদ ও প্রতারণামুক্ত দ্বীনি ম্যাট্রিমনি নিশ্চিতকরণে আমাদের পদক্ষেপ।",
    badge: "নিরাপত্তা",
    icon: "ri-shield-check-line",
    sections: [
      {
        heading: "অভিভাবক ছাড়া লেনদেন নিষিদ্ধ",
        body: "বিয়ের পূর্বে যেকোনো প্রকার আর্থিক লেনদেন থেকে বিরত থাকুন এবং সর্বদা উভয় পরিবারের অভিভাবকদের সরাসরি সাক্ষাতের মাধ্যমে খোঁজখবর নিন।",
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function StaticInfoPage({ params }: PageProps) {
  const { slug } = await params;
  const pathKey = slug.join("/");
  const page = STATIC_PAGES[pathKey];

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="bg-lavender border-b border-border/40 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand mb-3">
            {page.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand">{page.title}</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{page.subtitle}</p>
        </div>
      </section>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-5">
          {page.sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-xl border border-gray-100 bg-card p-6 shadow-xs"
            >
              <h2 className="text-base sm:text-lg font-extrabold text-brand mb-2">
                {section.heading}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={page.ctaHref || "/biodatas"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all"
            >
              <span>{page.ctaLabel || "বায়োডাটা খুঁজুন"}</span>
              <i className="ri-arrow-right-line" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all"
            >
              হোম পেজে ফিরুন
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
