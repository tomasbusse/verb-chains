"use client";

import { BlockCategory, CATEGORY_COLORS } from "@/lib/blocks";

interface BlockProps {
  text: string;
  category: BlockCategory;
  onDoubleClick?: () => void;
  "data-id"?: string;
}

export function Block({ text, category, onDoubleClick, ...props }: BlockProps) {
  return (
    <div
      className="block"
      style={{ backgroundColor: CATEGORY_COLORS[category] }}
      onDoubleClick={onDoubleClick}
      data-category={category}
      {...props}
    >
      {text}
    </div>
  );
}
