import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Rooms table - one per class/session
  rooms: defineTable({
    roomId: v.string(),
    name: v.optional(v.string()),
    isLocked: v.boolean(),
    createdAt: v.number(),
    lastActive: v.number(),
  }).index("by_roomId", ["roomId"]),

  // Workspace blocks - the collaborative state
  workspaceBlocks: defineTable({
    roomId: v.string(),
    blockId: v.string(),
    text: v.string(),
    category: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_order", ["roomId", "order"]),

  // Saved presets - reusable sentence templates
  presets: defineTable({
    roomId: v.string(),
    name: v.string(),
    blocks: v.array(
      v.object({
        text: v.string(),
        category: v.string(),
        order: v.number(),
      })
    ),
    createdAt: v.number(),
  }).index("by_room", ["roomId"]),
});
