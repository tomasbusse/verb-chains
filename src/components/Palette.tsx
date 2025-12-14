"use client";

import { useRef, useEffect } from "react";
import Sortable from "sortablejs";
import { PALETTE_BLOCKS, CATEGORY_COLORS, BlockCategory } from "@/lib/blocks";

interface PaletteProps {
  isLocked?: boolean;
}

export function Palette({ isLocked = false }: PaletteProps) {
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paletteRef.current) return;

    const sortable = Sortable.create(paletteRef.current, {
      group: {
        name: "blocks",
        pull: isLocked ? false : "clone",
        put: false,
      },
      sort: false,
      animation: 150,
      filter: ".group-label",
    });

    return () => {
      sortable.destroy();
    };
  }, [isLocked]);

  return (
    <div className="panel">
      <h2>Palette</h2>
      <p className="hint">These blocks represent grammar building units.</p>

      <div ref={paletteRef} id="palette" className="palette">
        {PALETTE_BLOCKS.map((item) => {
          if (item.isLabel) {
            return (
              <div key={item.id} className="group-label">
                {item.text}
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="block"
              style={{
                backgroundColor: CATEGORY_COLORS[item.category as BlockCategory],
                cursor: isLocked ? "not-allowed" : "grab",
                opacity: isLocked ? 0.6 : 1,
              }}
              data-category={item.category}
              data-text={item.text}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
