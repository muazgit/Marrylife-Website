import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContactRequestButton } from "@/components/contact-request-modal";
import { DashboardProposals } from "@/components/dashboard-proposals";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/biodata/123",
}));

describe("ContactRequestButton Component", () => {
  it("renders login CTA when user is not logged in", () => {
    render(
      <ContactRequestButton
        targetBiodataId="test-id"
        targetBiodataNumber={1}
        targetGender="groom"
        isLoggedIn={false}
        isOwnBiodata={false}
        hasUserBiodata={false}
        userCredits={0}
      />,
    );

    const btn = screen.getByRole("link", { name: /অভিভাবকের যোগাযোগের অনুরোধ করুন/i });
    expect(btn).toBeInTheDocument();
    expect(btn.getAttribute("href")).toContain("/login?next=/biodata/test-id");
  });

  it("renders active request button when user is logged in", () => {
    render(
      <ContactRequestButton
        targetBiodataId="test-id"
        targetBiodataNumber={1}
        targetGender="groom"
        isLoggedIn={true}
        isOwnBiodata={false}
        hasUserBiodata={true}
        userCredits={5}
      />,
    );

    expect(
      screen.getByRole("button", { name: /অভিভাবকের যোগাযোগের অনুরোধ করুন/i }),
    ).toBeInTheDocument();
  });

  it("renders unlocked contact details when proposal is accepted", () => {
    render(
      <ContactRequestButton
        targetBiodataId="test-id"
        targetBiodataNumber={1}
        targetGender="groom"
        isLoggedIn={true}
        isOwnBiodata={false}
        hasUserBiodata={true}
        userCredits={4}
        existingRequestStatus="accepted"
        unlockedContact={{
          candidate_name: "মোহাম্মদ আব্দুল্লাহ",
          guardian_name: "রফিকুল ইসলাম",
          guardian_relation: "পিতা",
          guardian_phone: "01711000000",
          full_address: "মিরপুর, ঢাকা",
        }}
      />,
    );

    expect(screen.getByText("অভিভাবকের যোগাযোগের তথ্য (উন্মুক্ত)")).toBeInTheDocument();
    expect(screen.getByText("মোহাম্মদ আব্দুল্লাহ")).toBeInTheDocument();
    expect(screen.getByText("01711000000")).toBeInTheDocument();
  });
});

describe("DashboardProposals Component", () => {
  it("renders empty state when there are no received proposals", () => {
    render(<DashboardProposals receivedProposals={[]} sentProposals={[]} />);

    expect(screen.getByText("বিয়ের প্রস্তাব ও যোগাযোগের অনুরোধ")).toBeInTheDocument();
    expect(screen.getByText("কোনো প্রাপ্ত প্রস্তাব নেই")).toBeInTheDocument();
  });

  it("renders proposal cards when received proposals exist", () => {
    render(
      <DashboardProposals
        receivedProposals={[
          {
            id: "req-1",
            status: "pending",
            created_at: new Date().toISOString(),
            guardian_response_note: "সালামু আলাইকুম",
            biodata: {
              id: "bio-1",
              biodata_number: 10,
              gender: "groom",
              occupation: "সফটওয়্যার ইঞ্জিনিয়ার",
              permanent_district: "ঢাকা",
              permanent_division: "ঢাকা",
            },
          },
        ]}
        sentProposals={[]}
      />,
    );

    expect(screen.getByText("ML-১০")).toBeInTheDocument();
    expect(screen.getByText("বিবেচনাধীন")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "সম্মতি দিন" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "প্রত্যাখ্যান" })).toBeInTheDocument();
  });
});
