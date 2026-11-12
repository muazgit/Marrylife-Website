import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginForm } from "@/app/login/login-form";
import { RegisterForm } from "@/app/register/register-form";

describe("Authentication Forms", () => {
  it("renders login form with email, password, and submit button", () => {
    render(<LoginForm nextUrl="/dashboard" />);

    expect(screen.getByLabelText("ইমেইল এড্রেস")).toBeInTheDocument();
    expect(screen.getByLabelText("পাসওয়ার্ড")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "লগইন করুন" })).toBeInTheDocument();

    // Toggle password visibility
    const toggleBtn = screen.getByLabelText("পাসওয়ার্ড দেখুন");
    fireEvent.click(toggleBtn);
    expect(screen.getByLabelText("পাসওয়ার্ড লুকান")).toBeInTheDocument();
  });

  it("renders registration form with all required Shariah fields and terms", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("আপনার পূর্ণ নাম")).toBeInTheDocument();
    expect(screen.getByLabelText("ইমেইল এড্রেস")).toBeInTheDocument();
    expect(screen.getByLabelText("পাসওয়ার্ড")).toBeInTheDocument();
    expect(screen.getByLabelText("পাসওয়ার্ড নিশ্চিত করুন")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeRequired();
  });
});
