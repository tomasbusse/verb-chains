"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sanitizeRoomId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setIsLoading(true);
    const roomId = sanitizeRoomId(roomName.trim());
    router.push(`/room/${roomId}`);
  };

  const handleRandomRoom = () => {
    setIsLoading(true);
    const randomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    router.push(`/room/${randomId}`);
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Verb Chains</h1>
        <p className="tagline">
          Collaborative sentence builder for teaching English verb chains
        </p>

        <form className="room-form" onSubmit={handleCreateRoom}>
          <input
            type="text"
            className="room-input"
            placeholder="Enter room name (e.g., B2-Monday)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="create-room-btn"
            disabled={!roomName.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create Room"}
          </button>

          <div className="or-divider">or</div>

          <button
            type="button"
            className="random-room-btn"
            onClick={handleRandomRoom}
            disabled={isLoading}
          >
            Create Random Room
          </button>
        </form>
      </div>
    </div>
  );
}
