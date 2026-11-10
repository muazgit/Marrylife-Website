import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BiodataCard, type BiodataCardSummary } from "@/components/biodata-card";

const sampleBiodata: BiodataCardSummary = {
  id: "00000000-0000-4000-8000-000000000001",
  biodata_number: 12,
  gender: "groom",
  marital_status: "never_married",
  birth_year: 1998,
  height_feet: 5,
  height_inches: 8,
  occupation: "সফটওয়্যার ইঞ্জিনিয়ার",
  highest_degree: "বিএসসি ইন সিএসই",
  permanent_district: "ঢাকা",
  permanent_division: "ঢাকা",
};

describe("BiodataCard", () => {
  it("renders Bengali biodata number, labels with colons, and toggles wishlist", () => {
    render(<BiodataCard biodata={sampleBiodata} />);

    expect(screen.getByText("ML-১২")).toBeInTheDocument();
    expect(screen.getByText("পাত্রের বায়োডাটা")).toBeInTheDocument();
    expect(screen.getByText("সফটওয়্যার ইঞ্জিনিয়ার")).toBeInTheDocument();
    expect(screen.getByText("বিএসসি ইন সিএসই")).toBeInTheDocument();

    const wishlistBtn = screen.getByRole("button", { name: "Wishlist" });
    expect(wishlistBtn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(wishlistBtn);
    expect(wishlistBtn).toHaveAttribute("aria-pressed", "true");
  });
});
