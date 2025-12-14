# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Verb Chains is a collaborative real-time sentence builder for teaching English verb chains and modals. Teachers create rooms and share links with students who can collaboratively drag-and-drop grammar blocks to build sentences.

**Production URL:** https://verb-chains.vercel.app

## Development Commands

```bash
# Start development (runs on port 3001)
npm run dev

# In a separate terminal, start Convex dev server
npx convex dev

# Build for production
npm run build

# Deploy Convex functions to production
npx convex deploy

# Lint
npm run lint
```

## Architecture

### Tech Stack
- **Frontend:** Next.js 16 (App Router) with React 19
- **Database:** Convex (real-time backend)
- **Drag-and-Drop:** react-sortablejs / SortableJS
- **Hosting:** Vercel
- **Styling:** Tailwind CSS + custom CSS in globals.css

### Key Directories

```
convex/           # Convex backend (schema, queries, mutations)
  schema.ts       # Database schema: rooms, workspaceBlocks, presets
  rooms.ts        # Room queries and mutations
  blocks.ts       # Block CRUD operations
  presets.ts      # Preset save/load operations

src/
  app/            # Next.js App Router pages
    page.tsx      # Home page (room creation)
    room/[roomId]/page.tsx  # Collaborative room page
  components/     # React components
    Workspace.tsx # Real-time collaborative workspace (main component)
    Palette.tsx   # Draggable block palette
    RoomControls.tsx # Lock, clear, preset controls
  lib/
    blocks.ts     # Block definitions and categories
```

### Data Flow

1. User drags block from Palette → SortableJS `onAdd` event
2. Workspace component calls Convex mutation (`addBlock`, `reorderBlocks`, `removeBlock`)
3. Convex broadcasts change to all connected clients
4. All clients receive real-time update via `useQuery` subscription

### Block Categories

8 color-coded grammar categories defined in `src/lib/blocks.ts`:
- subject, aux, modal, main, negation, object, time, connector

## Environment Variables

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL (set automatically by `npx convex dev`)
- Dev uses `.env.local`, production uses Vercel environment variables

## Convex Deployments

- **Dev:** `npx convex dev` (creates dev deployment)
- **Prod:** `npx convex deploy` (deploys to production)

The production Convex URL differs from dev. After running `npx convex deploy`, ensure Vercel has the correct `NEXT_PUBLIC_CONVEX_URL` for production.
