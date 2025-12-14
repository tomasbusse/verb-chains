"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Sortable from "sortablejs";
import {
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  SECTION_LABELS,
  BlockCategory,
  PaletteItem,
  getBlocksByCategory,
} from "@/lib/blocks";

interface PaletteProps {
  isLocked?: boolean;
}

const CUSTOM_BLOCKS_KEY = "verb-chains-custom-blocks";

function getCustomBlocks(): Record<BlockCategory, PaletteItem[]> {
  if (typeof window === "undefined") {
    return {
      subject: [],
      aux: [],
      modal: [],
      main: [],
      negation: [],
      object: [],
      time: [],
      connector: [],
    };
  }
  try {
    const stored = localStorage.getItem(CUSTOM_BLOCKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {
    subject: [],
    aux: [],
    modal: [],
    main: [],
    negation: [],
    object: [],
    time: [],
    connector: [],
  };
}

function saveCustomBlocks(blocks: Record<BlockCategory, PaletteItem[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_BLOCKS_KEY, JSON.stringify(blocks));
}

export function Palette({ isLocked = false }: PaletteProps) {
  const paletteRef = useRef<HTMLDivElement>(null);
  const [customBlocks, setCustomBlocks] = useState<Record<BlockCategory, PaletteItem[]>>(getCustomBlocks);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<BlockCategory | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Load custom blocks from localStorage on mount
  useEffect(() => {
    setCustomBlocks(getCustomBlocks());
  }, []);

  const baseBlocks = getBlocksByCategory();

  // Combine base blocks with custom blocks
  const allBlocksByCategory: Record<BlockCategory, PaletteItem[]> = {} as Record<BlockCategory, PaletteItem[]>;
  for (const cat of CATEGORY_ORDER) {
    allBlocksByCategory[cat] = [...baseBlocks[cat], ...customBlocks[cat]];
  }

  useEffect(() => {
    if (!paletteRef.current) return;

    // Create sortable for each category section
    const sortables: Sortable[] = [];
    const sections = paletteRef.current.querySelectorAll(".category-section");

    sections.forEach((section) => {
      const sortable = Sortable.create(section as HTMLElement, {
        group: {
          name: "blocks",
          pull: isLocked ? false : "clone",
          put: false,
        },
        sort: false,
        animation: 150,
        draggable: ".block",
        filter: ".group-label, .add-btn, .remove-custom-btn",
        preventOnFilter: false,
      });
      sortables.push(sortable);
    });

    return () => {
      sortables.forEach((s) => s.destroy());
    };
  }, [isLocked, customBlocks]);

  const openAddModal = useCallback((category: BlockCategory) => {
    setModalCategory(category);
    setInputValue("");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalCategory(null);
    setInputValue("");
  }, []);

  const handleAddWords = useCallback(() => {
    if (!modalCategory || !inputValue.trim()) {
      closeModal();
      return;
    }

    // Parse input: split by comma or newline, trim whitespace
    const words = inputValue
      .split(/[,\n]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (words.length === 0) {
      closeModal();
      return;
    }

    const newBlocks: PaletteItem[] = words.map((word, idx) => ({
      id: `custom-${modalCategory}-${Date.now()}-${idx}`,
      text: word,
      category: modalCategory,
      isCustom: true,
    }));

    const updated = {
      ...customBlocks,
      [modalCategory]: [...customBlocks[modalCategory], ...newBlocks],
    };
    setCustomBlocks(updated);
    saveCustomBlocks(updated);
    closeModal();
  }, [modalCategory, inputValue, customBlocks, closeModal]);

  const handleRemoveCustomBlock = useCallback((category: BlockCategory, blockId: string) => {
    const updated = {
      ...customBlocks,
      [category]: customBlocks[category].filter((b) => b.id !== blockId),
    };
    setCustomBlocks(updated);
    saveCustomBlocks(updated);
  }, [customBlocks]);

  return (
    <div className="panel">
      <h2>Palette</h2>
      <p className="hint">These blocks represent grammar building units. Click + to add custom words.</p>

      <div ref={paletteRef} id="palette" className="palette">
        {CATEGORY_ORDER.map((category) => (
          <div key={category} className="category-section">
            <div className="group-label">
              <span>{SECTION_LABELS[category]}</span>
              <button
                className="add-btn"
                onClick={() => openAddModal(category)}
                title={`Add custom ${SECTION_LABELS[category].toLowerCase()}`}
                disabled={isLocked}
              >
                +
              </button>
            </div>
            {allBlocksByCategory[category].map((block) => (
              <div
                key={block.id}
                className={`block ${block.isCustom ? "custom-block" : ""}`}
                style={{
                  backgroundColor: CATEGORY_COLORS[category],
                  cursor: isLocked ? "not-allowed" : "grab",
                  opacity: isLocked ? 0.6 : 1,
                }}
                data-category={category}
                data-text={block.text}
              >
                {block.text}
                {block.isCustom && (
                  <button
                    className="remove-custom-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCustomBlock(category, block.id);
                    }}
                    title="Remove custom word"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add Words Modal */}
      {modalOpen && modalCategory && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add {SECTION_LABELS[modalCategory]}</h3>
            <p>Enter words separated by commas or new lines:</p>
            <textarea
              className="preset-input add-words-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., run, jump, swim"
              autoFocus
              rows={4}
            />
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleAddWords}
                disabled={!inputValue.trim()}
              >
                Add Words
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
