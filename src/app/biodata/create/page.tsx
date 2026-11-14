import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { BiodataWizardForm } from "./biodata-form";

export const metadata = {
  title: "বিনামূল্যে বায়োডাটা তৈরি করুন | MarryLife",
  description: "শরীয়াহসম্মত উপায়ে আপনার অথবা আপনার পরিবারের সদস্যের বায়োডাটা তৈরি ও জমা দিন।",
};

export default async function CreateBiodataPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, show instructions and login CTA
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-lavender border-b border-border/40 py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand mb-3">
              <i className="ri-sparkling-fill text-brand-pink" /> বিনামূল্যে বায়োডাটা তৈরি
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand">
              শরীয়াহসম্মত উপায়ে আপনার বায়োডাটা তৈরি করুন
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              MarryLife-এ বায়োডাটা তৈরি ও সংরক্ষণ সম্পূর্ণ নিরাপদ ও বিনামূল্যে। কোনো প্রকাশ্য ছবি
              বা অবাধ চ্যাট ছাড়া শুধুমাত্র অভিভাবকের তত্ত্বাবধানে সঠিক দ্বীনদার জীবনসঙ্গী খুঁজুন।
            </p>
          </div>
        </section>

        {/* Requirements and CTA */}
        <main className="flex-1 py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-card p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-base sm:text-lg font-extrabold text-brand flex items-center gap-2 pb-3 border-b border-border/60">
                <i className="ri-shield-check-line text-brand-pink text-xl" />
                বায়োডাটা তৈরির আবশ্যকীয় পূর্বশর্তসমূহ
              </h2>

              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-base shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">নিয়মিত পাঁচ ওয়াক্ত নামাজ:</strong>{" "}
                    প্রার্থীর অবশ্যই দৈনিক পাঁচ ওয়াক্ত নামাজ আদায় করার বাধ্যবাধকতা রয়েছে।
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-base shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">সুন্নতি দাড়ি ও পর্দা:</strong> পাত্রের
                    ক্ষেত্রে সুন্নতি দাড়ি এবং পাত্রীর ক্ষেত্রে শরীয়াহসম্মত পর্দা (নিকাব/হিজাব)
                    আবশ্যক।
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-base shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">অভিভাবকের পূর্ণ সম্মতি:</strong> বিয়ের
                    বায়োডাটা তৈরি ও প্রস্তাব গ্রহণের জন্য পিতা, মাতা বা আইনসম্মত অভিভাবকের অবগতি ও
                    সম্মতি থাকা অপরিহার্য।
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-base shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">সততা ও সঠিক তথ্য:</strong> শিক্ষাগত যোগ্যতা,
                    ঠিকানা ও পারিবারিক তথ্যে কোনো মিথ্যা বা বিভ্রান্তি গ্রহণযোগ্য নয়।
                  </span>
                </li>
              </ul>

              <div className="rounded-xl border border-border/80 bg-lavender/40 p-4 text-xs text-muted-foreground">
                <i className="ri-lock-line text-brand mr-1" />
                <strong>গোপনীয়তার প্রতিশ্রুতি:</strong> আপনার ও অভিভাবকের নাম এবং মোবাইল নম্বর
                কখনোই পাবলিক তালিকায় প্রকাশিত হবে না।
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?next=/biodata/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer active:scale-95"
              >
                <span>লগইন করে বায়োডাটা তৈরি শুরু করুন</span>
                <i className="ri-arrow-right-line" />
              </Link>
              <Link
                href="/register?next=/biodata/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                <span>নতুন অ্যাকাউন্ট খুলুন</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fetch existing biodata for the user
  const { data: userBiodata } = await supabase
    .from("biodatas")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let contactData = null;
  if (userBiodata?.id) {
    const { data: fetchedContact } = await supabase
      .from("biodata_contacts")
      .select("*")
      .eq("biodata_id", userBiodata.id)
      .maybeSingle();
    contactData = fetchedContact;
  }

  const isEditing = Boolean(userBiodata?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-lavender border-b border-border/40 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-0.5 text-xs font-bold text-brand">
              <i className="ri-file-text-line" />{" "}
              {isEditing ? "বায়োডাটা সম্পাদনা" : "বায়োডাটা তৈরি"}
            </span>
            <span className="text-xs text-muted-foreground">৭টি সহজ ধাপ</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-brand">
            {isEditing ? "আপনার বায়োডাটা সম্পাদনা করুন" : "বিনামূল্যে বায়োডাটা তৈরি করুন"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            শরীয়াহসম্মত তথ্যাবলী নির্ভুলভাবে পূরণ করুন। প্রতিটি ধাপ স্বয়ংক্রিয়ভাবে যাচাই করা হয়।
          </p>
        </div>
      </section>

      {/* Main Wizard Form */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <BiodataWizardForm
            initialBiodata={userBiodata}
            initialContact={contactData}
            userEmail={user.email}
          />
        </div>
      </main>
    </div>
  );
}
