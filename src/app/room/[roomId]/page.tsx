"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Palette } from "@/components/Palette";
import { Workspace } from "@/components/Workspace";
import { Legend } from "@/components/Legend";
import { RoomHeader } from "@/components/RoomHeader";
import { RoomControls } from "@/components/RoomControls";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [isInitialized, setIsInitialized] = useState(false);

  const room = useQuery(api.rooms.getRoom, { roomId });
  const getOrCreateRoom = useMutation(api.rooms.getOrCreateRoom);
  const toggleLock = useMutation(api.rooms.toggleLock);

  // Initialize room on first load
  useEffect(() => {
    if (!isInitialized && roomId) {
      getOrCreateRoom({ roomId }).then(() => setIsInitialized(true));
    }
  }, [roomId, getOrCreateRoom, isInitialized]);

  const handleToggleLock = async () => {
    try {
      await toggleLock({ roomId });
    } catch (error) {
      console.error("Failed to toggle lock:", error);
    }
  };

  const isLocked = room?.isLocked ?? false;

  return (
    <div className="app">
      <h1>Verb Chains – Modals & Verb Chains</h1>
      <p className="subtitle">
        Drag blocks from the palette into the sentence workspace.
        <br />
        Double-click a block in the workspace to delete it.
      </p>

      <RoomHeader roomId={roomId} isLocked={isLocked} />
      <RoomControls
        roomId={roomId}
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
      />

      <div className="panels">
        <Palette isLocked={isLocked} />
        <Workspace roomId={roomId} isLocked={isLocked} />
      </div>

      <Legend />
    </div>
  );
}
