import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Add a block to workspace
export const addBlock = mutation({
  args: {
    roomId: v.string(),
    blockId: v.string(),
    text: v.string(),
    category: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if room is locked
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room?.isLocked) {
      throw new Error("Room is locked");
    }

    const now = Date.now();
    await ctx.db.insert("workspaceBlocks", {
      roomId: args.roomId,
      blockId: args.blockId,
      text: args.text,
      category: args.category,
      order: args.order,
      createdAt: now,
      updatedAt: now,
    });

    // Update room lastActive
    if (room) {
      await ctx.db.patch(room._id, { lastActive: now });
    }
  },
});

// Remove a block from workspace
export const removeBlock = mutation({
  args: { blockId: v.string(), roomId: v.string() },
  handler: async (ctx, args) => {
    // Check if room is locked
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room?.isLocked) {
      throw new Error("Room is locked");
    }

    const blocks = await ctx.db
      .query("workspaceBlocks")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const block = blocks.find((b) => b.blockId === args.blockId);
    if (block) {
      await ctx.db.delete(block._id);
    }

    // Update room lastActive
    if (room) {
      await ctx.db.patch(room._id, { lastActive: Date.now() });
    }
  },
});

// Reorder blocks in workspace (batch update)
export const reorderBlocks = mutation({
  args: {
    roomId: v.string(),
    blockOrders: v.array(
      v.object({
        blockId: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if room is locked
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room?.isLocked) {
      throw new Error("Room is locked");
    }

    const now = Date.now();
    const blocks = await ctx.db
      .query("workspaceBlocks")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const { blockId, order } of args.blockOrders) {
      const block = blocks.find((b) => b.blockId === blockId);
      if (block) {
        await ctx.db.patch(block._id, { order, updatedAt: now });
      }
    }

    // Update room lastActive
    if (room) {
      await ctx.db.patch(room._id, { lastActive: now });
    }
  },
});

// Clear entire workspace
export const clearWorkspace = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    // Check if room is locked
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room?.isLocked) {
      throw new Error("Room is locked");
    }

    const blocks = await ctx.db
      .query("workspaceBlocks")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const block of blocks) {
      await ctx.db.delete(block._id);
    }

    // Update room lastActive
    if (room) {
      await ctx.db.patch(room._id, { lastActive: Date.now() });
    }
  },
});
