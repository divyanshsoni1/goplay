"use client";

import { useCallback, useRef, useState } from "react";
import styles from "../page.module.css";
import type { FaqItem } from "./faqs-data";
import { faqs } from "./faqs-data";

export { faqs };

export function FaqAccordion({ items = faqs }: { items?: FaqItem[] }) {
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
      className={styles.faqWrap}
      role="region"
      aria-label="Frequently asked questions"
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-btn-${index}`;

        return (
          <div
            key={item.q}
            className={styles.faqItem}
            /* open attribute drives the CSS ::after chevron rotation */
            {...(isOpen ? { "data-open": "" } : {})}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={buttonId}
                ref={(el) => { itemRefs.current[index] = el; }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={styles.faqItem + "__btn"}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "20px 24px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--navy, #000666)",
                  boxSizing: "border-box",
                  transition: "background 0.2s ease",
                  background: isOpen ? "var(--surface-alt, #f3f4f5)" : "transparent",
                }}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--orange, #ff5b16)",
                    fontSize: 18,
                    flexShrink: 0,
                    marginLeft: 16,
                    display: "inline-block",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  ▾
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
            >
              <p
                style={{
                  borderTop: "1px solid var(--border, #c6c5d4)",
                  color: "var(--body, #454652)",
                  lineHeight: 1.7,
                  margin: "0 24px",
                  padding: "18px 0",
                  fontSize: 15,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
