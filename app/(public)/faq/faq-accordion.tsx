"use client";

import { useCallback, useRef, useState } from "react";
import type { FaqItem } from "./faqs-data";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const count = items.length;
      let next: number | null = null;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        next = (index + 1) % count;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        next = (index - 1 + count) % count;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = count - 1;
      }

      if (next !== null) {
        itemRefs.current[next]?.focus();
      }
    },
    [items.length],
  );

  return (
    <div
      role="region"
      aria-label="Frequently asked questions"
      style={{
        display: "grid",
        gap: 12,
      }}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-btn-${index}`;

        return (
          <div
            key={item.q}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid var(--border-light, #f0f0f0)",
              boxShadow: isOpen
                ? "0 4px 16px rgba(0,0,0,0.04)"
                : "0 1px 4px rgba(0,0,0,0.02)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
              overflow: "hidden",
            }}
            className="faqItemWrapper"
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={buttonId}
                ref={(el) => { itemRefs.current[index] = el; }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "18px 24px",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--heading, #111827)",
                  boxSizing: "border-box",
                  transition: "background 0.2s ease, color 0.2s ease",
                  background: isOpen ? "var(--surface-alt, #f8fafc)" : "transparent",
                }}
                className="faqButton"
              >
                <span style={{ paddingRight: 16 }}>{item.q}</span>
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--primary, #2563eb)",
                    fontSize: 20,
                    flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                    display: "inline-block",
                  }}
                >
                  ▼
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              style={{
                padding: "0 24px 20px 24px",
                borderTop: isOpen ? "1px solid var(--border-light, #f0f0f0)" : "none",
                transition: "border-color 0.3s ease",
              }}
            >
              <p
                style={{
                  color: "var(--body, #4b5563)",
                  lineHeight: 1.8,
                  margin: "20px 0 0 0",
                  fontSize: "0.95rem",
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}

      {/* Hover styles via style block */}
      <style>{`
        .faqItemWrapper:hover {
          border-color: var(--border, #e5e7eb);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .faqButton:hover {
          background: var(--surface-alt, #f8fafc);
        }
        .faqButton:hover span:last-child {
          color: var(--primary-dark, #1d4ed8);
        }
      `}</style>
    </div>
  );
}