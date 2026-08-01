"use client";

/**
 * components/referral/ReferralHistory.tsx
 *
 * Shows a paginated table of users referred by the current user.
 * Fetches from GET /api/referral/history.
 *
 * States: loading skeleton → empty state → populated list → error
 * Newest entries first. Pagination controls at the bottom.
 */

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferralItem {
  id: string;
  name: string;
  joinedAt: string;
  status: "Successful";
}

interface HistoryData {
  items: ReferralItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading referral history">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 0",
            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 13, width: "50%", background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 11, width: "35%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
          </div>
          <div style={{ height: 22, width: 70, background: "rgba(255,255,255,0.06)", borderRadius: 20 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "rgba(255,255,255,0.35)",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">👥</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        No referrals yet
      </div>
      <div style={{ fontSize: 13 }}>
        Share your link above and your referrals will appear here.
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, total, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
        Page {page} of {totalPages} · {total} total
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          style={{
            padding: "6px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: page <= 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            fontSize: 13,
            cursor: page <= 1 ? "not-allowed" : "pointer",
            fontWeight: 500,
          }}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          style={{
            padding: "6px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: page >= totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            fontSize: 13,
            cursor: page >= totalPages ? "not-allowed" : "pointer",
            fontWeight: 500,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReferralHistory() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  const fetchHistory = useCallback(
    (p: number) => {
      let cancelled = false;
      setLoading(true);
      setError(false);
      fetch(`/api/referral/history?page=${p}&pageSize=10`)
        .then((r) => r.json())
        .then((json) => {
          if (cancelled) return;
          if (json.success) {
            setData(json.data as HistoryData);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    },
    []
  );

  useEffect(() => {
    const cancel = fetchHistory(page);
    return cancel;
  }, [fetchHistory, page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <section
      aria-labelledby="referral-history-heading"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "28px",
        marginBottom: 24,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
      `}</style>

      <h2
        id="referral-history-heading"
        style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}
      >
        Referral History
      </h2>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>
        People who joined GoPlay using your link.
      </p>

      {/* Loading */}
      {loading && <HistorySkeleton />}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, padding: "20px 0" }}
        >
          Failed to load referral history.{" "}
          <button
            type="button"
            onClick={() => fetchHistory(page)}
            style={{
              background: "none",
              border: "none",
              color: "#ff5b16",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              padding: 0,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data?.items.length === 0 && <EmptyState />}

      {/* List */}
      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div role="list" aria-label="Referred users">
            {data.items.map((item, idx) => (
              <div
                key={item.id}
                role="listitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom:
                    idx < data.items.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                {/* Avatar */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(255,91,22,0.4), rgba(255,91,22,0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ff5b16",
                    flexShrink: 0,
                    border: "1px solid rgba(255,91,22,0.25)",
                  }}
                >
                  {getInitials(item.name)}
                </div>

                {/* Name + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                    Joined {formatDate(item.joinedAt)}
                  </div>
                </div>

                {/* Status badge */}
                <span
                  aria-label="Successful referral"
                  style={{
                    padding: "3px 10px",
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(74,222,128,0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  ✓ {item.status}
                </span>
              </div>
            ))}
          </div>

          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}
    </section>
  );
}
