"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toBengaliNumber } from "@/lib/utils/bengali";

interface BiodataPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function BiodataPagination({ currentPage, totalPages }: BiodataPaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  /** Build href for a given page number, preserving all other search params. */
  function getPageHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    return `/biodatas?${params.toString()}`;
  }

  /** Calculate which page numbers to show (max 5 around current). */
  function getVisiblePages(): number[] {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Ensure we show at least 5 pages if available
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const visiblePages = getVisiblePages();
  const firstVisible = visiblePages[0] ?? 1;
  const lastVisible = visiblePages[visiblePages.length - 1] ?? totalPages;

  return (
    <nav
      role="navigation"
      aria-label="পৃষ্ঠা নেভিগেশন"
      className="flex items-center justify-center gap-1.5 sm:gap-2"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageHref(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors"
        >
          <i className="ri-arrow-left-s-line text-lg" />
          <span className="hidden sm:inline">আগের</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-muted-foreground/40 shadow-2xs cursor-not-allowed">
          <i className="ri-arrow-left-s-line text-lg" />
          <span className="hidden sm:inline">আগের</span>
        </span>
      )}

      {/* Page 1 + ellipsis if needed */}
      {firstVisible > 1 && (
        <>
          <Link
            href={getPageHref(1)}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border bg-card text-xs sm:text-sm font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors"
          >
            {toBengaliNumber(1)}
          </Link>
          {firstVisible > 2 && (
            <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-muted-foreground text-sm">
              ···
            </span>
          )}
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page) => (
        <Link
          key={page}
          href={getPageHref(page)}
          className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-xs sm:text-sm font-bold shadow-2xs transition-colors ${
            page === currentPage
              ? "bg-brand text-brand-foreground border border-brand shadow-sm"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {toBengaliNumber(page)}
        </Link>
      ))}

      {/* Ellipsis + last page if needed */}
      {lastVisible < totalPages && (
        <>
          {lastVisible < totalPages - 1 && (
            <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-muted-foreground text-sm">
              ···
            </span>
          )}
          <Link
            href={getPageHref(totalPages)}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border bg-card text-xs sm:text-sm font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors"
          >
            {toBengaliNumber(totalPages)}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageHref(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors"
        >
          <span className="hidden sm:inline">পরের</span>
          <i className="ri-arrow-right-s-line text-lg" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-muted-foreground/40 shadow-2xs cursor-not-allowed">
          <span className="hidden sm:inline">পরের</span>
          <i className="ri-arrow-right-s-line text-lg" />
        </span>
      )}
    </nav>
  );
}
