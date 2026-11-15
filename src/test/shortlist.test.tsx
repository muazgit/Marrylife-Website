import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShortlistView } from "@/app/shortlist/shortlist-view";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/shortlist",
}));

describe("ShortlistView Component", () => {
  it("renders empty state and guest notice when visitor is not logged in", () => {
    render(<ShortlistView initialBiodatas={[]} isLoggedIn={false} />);

    expect(screen.getByText("আপনার শর্টলিস্ট বর্তমানে খালি")).toBeInTheDocument();
    expect(screen.getByText("লগইন করে শর্টলিস্ট সংরক্ষণ করুন:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "বায়োডাটা খুঁজুন" })).toBeInTheDocument();
  });

  it("renders list of shortlisted candidates when items exist", () => {
    render(
      <ShortlistView
        initialBiodatas={[
          {
            id: "bio-1",
            biodata_number: 101,
            gender: "bride",
            marital_status: "never_married",
            birth_year: 2000,
            height_feet: 5,
            height_inches: 3,
            occupation: "শিক্ষিকা",
            highest_degree: "মাস্টার্স",
            permanent_district: "ঢাকা",
            permanent_division: "ঢাকা",
          },
        ]}
        isLoggedIn={true}
      />,
    );

    expect(screen.getByText("ML-১০১")).toBeInTheDocument();
    expect(screen.getByText("পাত্রীর বায়োডাটা")).toBeInTheDocument();
    expect(screen.getByText("তালিকা খালি করুন")).toBeInTheDocument();
  });
});
