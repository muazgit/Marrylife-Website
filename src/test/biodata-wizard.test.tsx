import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BiodataWizardForm } from "@/app/biodata/create/biodata-form";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/biodata/create",
}));

describe("BiodataWizardForm Component", () => {
  it("renders step 1 with all general information fields", () => {
    render(<BiodataWizardForm userEmail="test@example.com" />);

    // Step 1 title and fields
    expect(screen.getAllByText("সাধারণ তথ্য").length).toBeGreaterThan(0);
    expect(screen.getByText("বায়োডাটার ধরন")).toBeInTheDocument();
    expect(screen.getByText("পাত্রের বায়োডাটা")).toBeInTheDocument();
    expect(screen.getByText("পাত্রীর বায়োডাটা")).toBeInTheDocument();
    expect(screen.getByText("বৈবাহিক অবস্থা")).toBeInTheDocument();
    expect(screen.getByText("জন্ম সাল")).toBeInTheDocument();
    expect(screen.getByText("উচ্চতা")).toBeInTheDocument();
    expect(screen.getByText("গায়ের রঙ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /পরবর্তী ধাপ/i })).toBeInTheDocument();
  });

  it("allows switching gender and marital status", () => {
    render(<BiodataWizardForm userEmail="test@example.com" />);

    const brideBtn = screen.getByRole("button", { name: /পাত্রীর বায়োডাটা/i });
    fireEvent.click(brideBtn);

    const divorcedBtn = screen.getByRole("button", { name: "ডিভোর্সড" });
    fireEvent.click(divorcedBtn);

    expect(brideBtn.className).toContain("text-brand-pink");
    expect(divorcedBtn.className).toContain("text-brand");
  });

  it("navigates from step 1 to step 2 when clicking next", () => {
    render(<BiodataWizardForm userEmail="test@example.com" />);

    const nextBtn = screen.getByRole("button", { name: /পরবর্তী ধাপ/i });
    fireEvent.click(nextBtn);

    // Should now be on step 2 (ঠিকানা)
    expect(screen.getByText("ঠিকানার বিবরণ")).toBeInTheDocument();
    expect(screen.getByText("বর্তমান ঠিকানা")).toBeInTheDocument();
    expect(screen.getByText("স্থায়ী ঠিকানা")).toBeInTheDocument();
  });
});
