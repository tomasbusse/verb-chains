export type BlockCategory =
  | "subject"
  | "aux"
  | "modal"
  | "main"
  | "negation"
  | "object"
  | "time"
  | "connector";

export interface PaletteItem {
  id: string;
  text: string;
  category?: BlockCategory;
  isLabel?: boolean;
  isCustom?: boolean;
}

// Category order for display
export const CATEGORY_ORDER: BlockCategory[] = [
  "subject",
  "aux",
  "modal",
  "main",
  "negation",
  "object",
  "time",
  "connector",
];

export const PALETTE_BLOCKS: PaletteItem[] = [
  { id: "label-subjects", text: "Subjects", isLabel: true },
  { id: "subject-1", text: "I", category: "subject" },
  { id: "subject-2", text: "you", category: "subject" },
  { id: "subject-3", text: "we", category: "subject" },
  { id: "subject-4", text: "they", category: "subject" },
  { id: "subject-5", text: "my team", category: "subject" },
  { id: "subject-6", text: "the company", category: "subject" },

  { id: "label-aux", text: "Auxiliaries (finite verb 1)", isLabel: true },
  { id: "aux-1", text: "do", category: "aux" },
  { id: "aux-2", text: "does", category: "aux" },
  { id: "aux-3", text: "did", category: "aux" },
  { id: "aux-4", text: "am", category: "aux" },
  { id: "aux-5", text: "is", category: "aux" },
  { id: "aux-6", text: "are", category: "aux" },
  { id: "aux-7", text: "was", category: "aux" },
  { id: "aux-8", text: "were", category: "aux" },
  { id: "aux-9", text: "have", category: "aux" },
  { id: "aux-10", text: "has", category: "aux" },
  { id: "aux-11", text: "had", category: "aux" },
  { id: "aux-12", text: "be", category: "aux" },
  { id: "aux-13", text: "being", category: "aux" },
  { id: "aux-14", text: "been", category: "aux" },

  { id: "label-modals", text: "Modals", isLabel: true },
  { id: "modal-1", text: "can", category: "modal" },
  { id: "modal-2", text: "could", category: "modal" },
  { id: "modal-3", text: "may", category: "modal" },
  { id: "modal-4", text: "might", category: "modal" },
  { id: "modal-5", text: "will", category: "modal" },
  { id: "modal-6", text: "would", category: "modal" },
  { id: "modal-7", text: "must", category: "modal" },
  { id: "modal-8", text: "should", category: "modal" },

  { id: "label-chunks", text: 'Verb + "to" chunks', isLabel: true },
  { id: "main-1", text: "have to", category: "main" },
  { id: "main-2", text: "has to", category: "main" },
  { id: "main-3", text: "had to", category: "main" },
  { id: "main-4", text: "want to", category: "main" },
  { id: "main-5", text: "wants to", category: "main" },
  { id: "main-6", text: "going to", category: "main" },
  { id: "main-7", text: "able to", category: "main" },
  { id: "main-8", text: "used to", category: "main" },

  { id: "label-verbs", text: "Main verbs (base form)", isLabel: true },
  { id: "main-9", text: "deliver", category: "main" },
  { id: "main-10", text: "speed up", category: "main" },
  { id: "main-11", text: "get up", category: "main" },
  { id: "main-12", text: "live", category: "main" },
  { id: "main-13", text: "smoke", category: "main" },
  { id: "main-14", text: "email", category: "main" },
  { id: "main-15", text: "finish", category: "main" },
  { id: "main-16", text: "work", category: "main" },

  { id: "label-negation", text: "Negation", isLabel: true },
  { id: "negation-1", text: "not", category: "negation" },
  { id: "negation-2", text: "never", category: "negation" },

  { id: "label-objects", text: "Objects", isLabel: true },
  { id: "object-1", text: "it", category: "object" },
  { id: "object-2", text: "the delivery", category: "object" },
  { id: "object-3", text: "the report", category: "object" },
  { id: "object-4", text: "our target", category: "object" },

  { id: "label-time", text: "Time / Adverbials", isLabel: true },
  { id: "time-1", text: "today", category: "time" },
  { id: "time-2", text: "this week", category: "time" },
  { id: "time-3", text: "next week", category: "time" },
  { id: "time-4", text: "by the end of the week", category: "time" },
  { id: "time-5", text: "for three years", category: "time" },
  { id: "time-6", text: "already", category: "time" },
  { id: "time-7", text: "yet", category: "time" },
  { id: "time-8", text: "usually", category: "time" },

  { id: "label-connectors", text: "Connectors", isLabel: true },
  { id: "connector-1", text: "but", category: "connector" },
  { id: "connector-2", text: "because", category: "connector" },
  { id: "connector-3", text: "so", category: "connector" },
];

// Helper to get only draggable blocks (not labels)
export const getDraggableBlocks = () =>
  PALETTE_BLOCKS.filter((item) => !item.isLabel);

// Get blocks organized by category
export const getBlocksByCategory = (): Record<BlockCategory, PaletteItem[]> => {
  const result: Record<BlockCategory, PaletteItem[]> = {
    subject: [],
    aux: [],
    modal: [],
    main: [],
    negation: [],
    object: [],
    time: [],
    connector: [],
  };

  for (const block of PALETTE_BLOCKS) {
    if (!block.isLabel && block.category) {
      result[block.category].push(block);
    }
  }

  return result;
};

// Section labels that match the original design
export const SECTION_LABELS: Record<BlockCategory, string> = {
  subject: "Subjects",
  aux: "Auxiliaries (finite verb 1)",
  modal: "Modals",
  main: "Verbs / Chunks",
  negation: "Negation",
  object: "Objects",
  time: "Time / Adverbials",
  connector: "Connectors",
};

// Category colors for styling
export const CATEGORY_COLORS: Record<BlockCategory, string> = {
  subject: "#e0f2ff",
  aux: "#e0f7ec",
  modal: "#fff3d9",
  main: "#ffe8e0",
  negation: "#ffd6de",
  object: "#e9e0ff",
  time: "#e5f2e0",
  connector: "#f0f0f0",
};

// Category labels for legend
export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  subject: "Subject",
  aux: 'Auxiliary (incl. all forms of "be")',
  modal: "Modal",
  main: 'Verb or Chunk ("have to", "able to", main verb)',
  negation: "Negation",
  object: "Object",
  time: "Time / Adverbial",
  connector: "Connector",
};
