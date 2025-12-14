import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Save current workspace as a preset
export const savePreset = mutation({
  args: {
    roomId: v.string(),
    name: v.string(),
    blocks: v.array(
      v.object({
        text: v.string(),
        category: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("presets", {
      roomId: args.roomId,
      name: args.name,
      blocks: args.blocks,
      createdAt: now,
    });
  },
});

// Load a preset into the workspace
export const loadPreset = mutation({
  args: { roomId: v.string(), presetId: v.id("presets") },
  handler: async (ctx, args) => {
    // Check if room is locked
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room?.isLocked) {
      throw new Error("Room is locked");
    }

    const preset = await ctx.db.get(args.presetId);
    if (!preset) {
      throw new Error("Preset not found");
    }

    // Clear existing blocks
    const existingBlocks = await ctx.db
      .query("workspaceBlocks")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const block of existingBlocks) {
      await ctx.db.delete(block._id);
    }

    // Add preset blocks
    const now = Date.now();
    for (const block of preset.blocks) {
      await ctx.db.insert("workspaceBlocks", {
        roomId: args.roomId,
        blockId: `block-${now}-${Math.random().toString(36).substr(2, 9)}`,
        text: block.text,
        category: block.category,
        order: block.order,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Update room lastActive
    if (room) {
      await ctx.db.patch(room._id, { lastActive: now });
    }
  },
});

// Delete a preset
export const deletePreset = mutation({
  args: { presetId: v.id("presets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.presetId);
  },
});
