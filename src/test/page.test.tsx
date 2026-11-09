import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the MarryLife hero headline and stats", () => {
    render(<HomePage />);
    expect(screen.getByText("দ্বীনি বন্ধনে গড়ে তুলুন")).toBeInTheDocument();
    expect(screen.getByText("আপনার আদর্শ পরিবার")).toBeInTheDocument();
  });
});
