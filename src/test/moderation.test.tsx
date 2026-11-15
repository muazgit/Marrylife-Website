import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModerationTable } from "@/app/admin/moderation/moderation-table";
import { approveBiodataAction, rejectBiodataAction } from "@/lib/actions/moderation";

// Mock next/navigation
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/admin/moderation",
}));

// Mock moderation actions
vi.mock("@/lib/actions/moderation", () => ({
  approveBiodataAction: vi.fn().mockResolvedValue({
    success: true,
    message: "বায়োডাটাটি সফলভাবে অনুমোদন করা হয়েছে।",
  }),
  rejectBiodataAction: vi.fn().mockResolvedValue({
    success: true,
    message: "বায়োডাটাটি সংশোধনের জন্য ফেরত পাঠানো হয়েছে।",
  }),
}));

const SAMPLE_PENDING_BIODATA = {
  id: "bio-99",
  biodata_number: 199,
  gender: "groom",
  marital_status: "never_married",
  birth_year: 1996,
  height_feet: 5,
  height_inches: 8,
  occupation: "সফটওয়্যার প্রকৌশলী",
  highest_degree: "বিএসসি",
  education_medium: "সাধারণ",
  permanent_district: "ঢাকা",
  permanent_division: "ঢাকা",
  prayer_frequency: "৫ ওয়াক্ত",
  observes_purdah_or_beard: true,
  mahram_non_mahram_care: true,
  expected_partner_qualities: "দ্বীনদার ও নামাজি পাত্রী",
  created_at: new Date().toISOString(),
  contact: {
    candidate_name: "মুহাম্মদ আব্দুল্লাহ",
    candidate_phone: "01711111111",
    guardian_name: "আব্দুর রহমান",
    guardian_relation: "পিতা",
    guardian_phone: "01722222222",
    full_address: "মিরপুর-১০, ঢাকা",
  },
};

describe("ModerationTable Component", () => {
  it("renders empty state when there are no pending biodatas", () => {
    render(<ModerationTable biodatas={[]} />);

    expect(screen.getByText("বর্তমানে কোনো যাচাইকরণ অপেক্ষমাণ নেই")).toBeInTheDocument();
  });

  it("renders pending biodata row with candidate and guardian information", () => {
    render(<ModerationTable biodatas={[SAMPLE_PENDING_BIODATA]} />);

    expect(screen.getByText("ML-১৯৯")).toBeInTheDocument();
    expect(screen.getByText("মুহাম্মদ আব্দুল্লাহ")).toBeInTheDocument();
    expect(screen.getByText("পাত্র")).toBeInTheDocument();
    expect(screen.getByText("সফটওয়্যার প্রকৌশলী")).toBeInTheDocument();
    expect(screen.getByText("আব্দুর রহমান (পিতা)")).toBeInTheDocument();
    expect(screen.getByText("01722222222")).toBeInTheDocument();
    expect(screen.getByText("অনুমোদন")).toBeInTheDocument();
    expect(screen.getByText("সংশোধন")).toBeInTheDocument();
  });

  it("approves biodata when confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<ModerationTable biodatas={[SAMPLE_PENDING_BIODATA]} />);

    const approveBtn = screen.getByText("অনুমোদন");
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(approveBiodataAction).toHaveBeenCalledWith("bio-99");
      expect(screen.queryByText("ML-১৯৯")).not.toBeInTheDocument();
      expect(screen.getByText("বায়োডাটাটি সফলভাবে অনুমোদন করা হয়েছে।")).toBeInTheDocument();
    });
  });

  it("opens correction modal and sends rejection with feedback note", async () => {
    render(<ModerationTable biodatas={[SAMPLE_PENDING_BIODATA]} />);

    const rejectBtn = screen.getByText("সংশোধন");
    fireEvent.click(rejectBtn);

    expect(screen.getByText("সংশোধনের কারণ উল্লেখ করুন")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/অভিভাবকের ফোন নম্বরে যোগাযোগ করা সম্ভব হয়নি/);
    fireEvent.change(textarea, {
      target: { value: "অভিভাবকের নম্বর সচল পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে নতুন নম্বর দিন।" },
    });

    const submitBtn = screen.getByText("সংশোধন পাঠান");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(rejectBiodataAction).toHaveBeenCalledWith(
        "bio-99",
        "অভিভাবকের নম্বর সচল পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে নতুন নম্বর দিন।",
      );
      expect(screen.queryByText("ML-১৯৯")).not.toBeInTheDocument();
      expect(screen.getByText("বায়োডাটাটি সংশোধনের জন্য ফেরত পাঠানো হয়েছে।")).toBeInTheDocument();
    });
  });
});
