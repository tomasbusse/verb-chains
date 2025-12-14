import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get room by ID
export const getRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
  },
});

// Get all blocks in a room (real-time subscription)
export const getWorkspaceBlocks = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const blocks = await ctx.db
      .query("workspaceBlocks")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    // Sort by order
    return blocks.sort((a, b) => a.order - b.order);
  },
});

// Get saved presets for a room
export const getPresets = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("presets")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

// Create or get a room (upsert)
export const getOrCreateRoom = mutation({
  args: { roomId: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (existing) {
      // Update lastActive
      await ctx.db.patch(existing._id, { lastActive: Date.now() });
      return existing;
    }

    const now = Date.now();
    const id = await ctx.db.insert("rooms", {
      roomId: args.roomId,
      name: args.name,
      isLocked: false,
      createdAt: now,
      lastActive: now,
    });

    return await ctx.db.get(id);
  },
});

// Toggle lock status
export const toggleLock = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();

    if (room) {
      await ctx.db.patch(room._id, {
        isLocked: !room.isLocked,
        lastActive: Date.now(),
      });
      return !room.isLocked;
    }
    return false;
  },
});
