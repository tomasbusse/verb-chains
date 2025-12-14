"use client";

import { useRef, useEffect, useCallback } from "react";
import Sortable, { SortableEvent } from "sortablejs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CATEGORY_COLORS, BlockCategory } from "@/lib/blocks";

interface WorkspaceProps {
  roomId: string;
  isLocked?: boolean;
}

export function Workspace({ roomId, isLocked = false }: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const sortableRef = useRef<Sortable | null>(null);

  const blocks = useQuery(api.rooms.getWorkspaceBlocks, { roomId }) ?? [];
  const addBlock = useMutation(api.blocks.addBlock);
  const removeBlock = useMutation(api.blocks.removeBlock);
  const reorderBlocks = useMutation(api.blocks.reorderBlocks);

  const handleAdd = useCallback(
    async (evt: SortableEvent) => {
      if (isLocked) return;

      const item = evt.item;
      const text = item.dataset.text || item.textContent || "";
      const category = item.dataset.category || "main";
      const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Remove the cloned element (we'll render from state)
      item.remove();

      try {
        await addBlock({
          roomId,
          blockId,
          text,
          category,
          order: evt.newIndex ?? 0,
        });
      } catch (error) {
        console.error("Failed to add block:", error);
      }
    },
    [roomId, addBlock, isLocked]
  );

  const handleSort = useCallback(async () => {
    if (isLocked || !workspaceRef.current) return;

    const items = workspaceRef.current.querySelectorAll(".block[data-block-id]");
    const blockOrders: { blockId: string; order: number }[] = [];

    items.forEach((item, index) => {
      const blockId = (item as HTMLElement).dataset.blockId;
      if (blockId) {
        blockOrders.push({ blockId, order: index });
      }
    });

    if (blockOrders.length > 0) {
      try {
        await reorderBlocks({ roomId, blockOrders });
      } catch (error) {
        console.error("Failed to reorder blocks:", error);
      }
    }
  }, [roomId, reorderBlocks, isLocked]);

  const handleDoubleClick = useCallback(
    async (blockId: string) => {
      if (isLocked) return;

      try {
        await removeBlock({ blockId, roomId });
      } catch (error) {
        console.error("Failed to remove block:", error);
      }
    },
    [roomId, removeBlock, isLocked]
  );

  useEffect(() => {
    if (!workspaceRef.current) return;

    // Destroy existing sortable if any
    if (sortableRef.current) {
      sortableRef.current.destroy();
    }

    sortableRef.current = Sortable.create(workspaceRef.current, {
      group: {
        name: "blocks",
        pull: !isLocked,
        put: !isLocked,
      },
      sort: !isLocked,
      animation: 150,
      onAdd: handleAdd,
      onEnd: handleSort,
    });

    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [handleAdd, handleSort, isLocked]);

  return (
    <div className="panel">
      <h2>Sentence Workspace</h2>
      <p className="hint">
        Build your verb chain here.
        <br />
        Only the <strong>first verb block</strong> is conjugated.
        {isLocked && (
          <span className="locked-hint"> (Workspace is locked)</span>
        )}
      </p>

      <div
        ref={workspaceRef}
        id="workspace"
        className={`workspace ${isLocked ? "locked" : ""}`}
      >
        {blocks.map((block) => (
          <div
            key={block.blockId}
            className="block"
            style={{
              backgroundColor: CATEGORY_COLORS[block.category as BlockCategory],
              cursor: isLocked ? "not-allowed" : "grab",
            }}
            data-block-id={block.blockId}
            data-category={block.category}
            onDoubleClick={() => handleDoubleClick(block.blockId)}
          >
            {block.text}
          </div>
        ))}
      </div>
    </div>
  );
}
