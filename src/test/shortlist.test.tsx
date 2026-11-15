import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShortlistView } from "@/app/shortlist/shortlist-view";

// Mock next/navigation
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/shortlist",
}));

// Mock shortlist actions
vi.mock("@/lib/actions/shortlist", () => ({
  toggleShortlistAction: vi.fn().mockResolvedValue({ success: true, isShortlisted: false }),
  syncLocalShortlistAction: vi.fn().mockResolvedValue({ success: true }),
  getShortlistedBiodatasAction: vi.fn().mockResolvedValue([]),
  removeFromShortlistAction: vi.fn().mockResolvedValue({ success: true }),
  clearAllShortlistsAction: vi.fn().mockResolvedValue({ success: true }),
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
    expect(screen.getByText("শর্টলিস্ট থেকে সরান")).toBeInTheDocument();
  });

  it("allows removing a single candidate from the shortlist", async () => {
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

    const removeBtn = screen.getByText("শর্টলিস্ট থেকে সরান");
    fireEvent.click(removeBtn);

    // After clicking remove, candidate is optimistically removed and empty state shows
    expect(screen.queryByText("ML-১০১")).not.toBeInTheDocument();
    expect(screen.getByText("আপনার শর্টলিস্ট বর্তমানে খালি")).toBeInTheDocument();
  });

  it("allows clearing all candidates when confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

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

    const clearAllBtn = screen.getByText("তালিকা খালি করুন");
    fireEvent.click(clearAllBtn);

    expect(screen.queryByText("ML-১০১")).not.toBeInTheDocument();
    expect(screen.getByText("আপনার শর্টলিস্ট বর্তমানে খালি")).toBeInTheDocument();
  });
});
