"use client";

import { useState } from "react";

interface RoomHeaderProps {
  roomId: string;
  isLocked: boolean;
}

export function RoomHeader({ roomId, isLocked }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${roomId}`
      : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="room-header">
      <div className="room-info">
        <span className="room-label">Room:</span>
        <span className="room-id">{roomId}</span>
        {isLocked && <span className="lock-badge">Locked</span>}
      </div>
      <button className="copy-link-btn" onClick={copyLink}>
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
