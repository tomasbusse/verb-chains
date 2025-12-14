# Product Requirements Document: Verb Chains

## 1. Overview

**Product Name:** Verb Chains - Collaborative Edition
**Version:** 2.0
**Last Updated:** December 2024
**Owner:** Tomas Busse

---

## 2. Problem Statement

English teachers need a visual tool for online lessons that allows multiple students to collaboratively build sentences in real-time, demonstrating verb chain structures. The existing static tool only supports single-user interaction and cannot be used effectively in live online classroom settings.

### Current Pain Points

- Single-user limitation prevents collaborative learning
- No persistence - work is lost on page refresh
- Cannot share sessions with students
- Teacher must screen-share and manually collect input

---

## 3. Goals & Success Metrics

### Goals

1. Enable real-time collaborative sentence building
2. Support multiple simultaneous users per room
3. Provide teacher controls for managing sessions
4. Maintain the simple, intuitive UX of the original tool

### Success Metrics

| Metric | Target |
|--------|--------|
| Real-time sync latency | < 1 second |
| Concurrent users per room | 10+ |
| Page load time | < 2 seconds |
| User adoption | Used in 80% of online grammar lessons |

---

## 4. User Stories

### Teacher Stories

1. **As a teacher**, I want to create a unique room for my class so that my students can join and collaborate.

2. **As a teacher**, I want to share a simple link with students so they can join without creating accounts.

3. **As a teacher**, I want to lock the workspace during explanations so students can observe without interference.

4. **As a teacher**, I want to save sentence presets so I can quickly load common examples.

5. **As a teacher**, I want to clear the workspace to start fresh activities.

### Student Stories

1. **As a student**, I want to join a room via a link so I can participate immediately.

2. **As a student**, I want to drag blocks to build sentences so I can practice grammar visually.

3. **As a student**, I want to see other students' changes in real-time so we can collaborate.

4. **As a student**, I want to double-click to remove blocks so I can correct mistakes easily.

---

## 5. Features

### 5.1 MVP Features

#### Room System
- URL-based rooms (`/room/[roomId]`)
- Auto-create room on first visit
- Shareable link with copy button
- Room state persists until cleared

#### Collaborative Workspace
- Real-time block synchronization
- Drag from palette (clone behavior)
- Reorder blocks within workspace
- Double-click to delete blocks
- All changes visible to all users instantly

#### Teacher Controls
- **Lock/Unlock Mode:** Freeze workspace to prevent changes
- **Clear Workspace:** Remove all blocks (with confirmation)
- **Save Preset:** Save current sentence as reusable template
- **Load Preset:** Quickly load saved sentences

#### Preserved UX
- Same 8-category color scheme
- Same block styling (pill shape)
- Same drag-and-drop interactions
- Responsive layout for mobile

### 5.2 Block Categories

| Category | Color | Examples |
|----------|-------|----------|
| Subject | Light Blue (#e0f2ff) | I, you, we, they |
| Auxiliary | Light Green (#e0f7ec) | do, does, am, is, have |
| Modal | Pale Yellow (#fff3d9) | can, could, will, must |
| Main/Chunk | Peach (#ffe8e0) | have to, going to, deliver |
| Negation | Pink (#ffd6de) | not, never |
| Object | Purple (#e9e0ff) | it, the report |
| Time | Soft Green (#e5f2e0) | today, this week |
| Connector | Grey (#f0f0f0) | but, because, so |

---

## 6. Post-MVP Features (Future)

1. **Teacher Authentication:** Secure teacher-only controls
2. **Usage Analytics:** Track engagement and popular patterns
3. **Custom Blocks:** Allow teachers to add custom vocabulary
4. **Multiple Workspaces:** Multiple sentence areas per room
5. **Chat/Comments:** In-app communication
6. **Export/Print:** Save sentences as images or PDF
7. **Question Mode:** Toggle blocks for building questions

---

## 7. Technical Requirements

### Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router) |
| Database | Convex (real-time) |
| Hosting | Vercel |
| Drag-Drop | react-sortablejs |
| Version Control | GitHub |

### Architecture

```
[Browser Clients] → [Convex Real-time DB] ← [Next.js on Vercel]
```

### Data Model

**Rooms Table:**
- roomId (string, unique)
- name (optional string)
- isLocked (boolean)
- createdAt (timestamp)
- lastActive (timestamp)

**WorkspaceBlocks Table:**
- roomId (foreign key)
- blockId (string)
- text (string)
- category (string)
- order (number)
- createdAt (timestamp)
- updatedAt (timestamp)

**Presets Table:**
- roomId (foreign key)
- name (string)
- blocks (array of block objects)
- createdAt (timestamp)

---

## 8. Non-Functional Requirements

### Performance
- Page load under 2 seconds
- Real-time sync under 1 second latency
- Support 20+ concurrent users per room

### Accessibility
- Color-coded with distinct hues for color blindness
- Keyboard navigable (future)
- Clear visual feedback on interactions

### Security
- No authentication required (by design)
- Rooms are anonymous and public
- No personal data collected

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive)

---

## 9. User Flow

### Teacher Flow

```
1. Visit homepage → 2. Enter room name → 3. Click "Create Room"
4. Share room link with students → 5. Wait for students to join
6. Build sentences collaboratively → 7. Lock workspace for explanations
8. Save presets for future use → 9. Clear workspace for new activities
```

### Student Flow

```
1. Receive room link from teacher → 2. Click link to join room
3. See shared workspace → 4. Drag blocks to build sentences
5. Observe teacher demonstrations → 6. Participate when unlocked
```

---

## 10. Out of Scope

- User accounts and authentication
- Private/password-protected rooms
- Chat or messaging functionality
- Grammar validation/correction
- Audio/video integration
- Native mobile apps
- Offline mode

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Convex service outage | Low | High | Graceful error handling, local fallback |
| Concurrent edit conflicts | Medium | Low | Last-write-wins, atomic updates |
| Abuse/spam in public rooms | Medium | Medium | Rate limiting, room expiration |
| Browser compatibility issues | Low | Medium | Cross-browser testing, polyfills |

---

## 12. Timeline

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 | Project setup, Convex schema | Complete |
| Phase 2 | Core components, real-time sync | Complete |
| Phase 3 | Teacher controls, presets | Complete |
| Phase 4 | Testing, deployment | In Progress |
| Phase 5 | User feedback, iteration | Pending |

---

## 13. Success Criteria Checklist

- [ ] Local dev server runs without errors
- [ ] Real-time sync works across 2+ browsers
- [ ] Room URLs are shareable and persistent
- [ ] Lock/Unlock mode works correctly
- [ ] Save/Load presets functionality works
- [ ] Clear workspace with confirmation
- [ ] Deployed to Vercel and accessible
- [ ] GitHub repository established
- [ ] Original UX preserved (colors, interactions)

---

## 14. Appendix

### URLs

- **Production:** https://verb-chains.vercel.app
- **GitHub:** https://github.com/tomasbusse/verb-chains

### Related Documents

- `sentence_builder_teacher_guide.md` - Pedagogical guide
- `sentence_builder_ai_coder_instructions.md` - Technical specifications
