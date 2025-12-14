"use client";

import {
  BlockCategory,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "@/lib/blocks";

const categories: BlockCategory[] = [
  "subject",
  "aux",
  "modal",
  "main",
  "negation",
  "object",
  "time",
  "connector",
];

export function Legend() {
  return (
    <div className="legend">
      {categories.map((category) => (
        <span key={category} className="legend-item">
          <span
            className="swatch"
            style={{ backgroundColor: CATEGORY_COLORS[category] }}
          />
          {CATEGORY_LABELS[category]}
        </span>
      ))}
    </div>
  );
}
