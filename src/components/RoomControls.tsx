"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface RoomControlsProps {
  roomId: string;
  isLocked: boolean;
  onToggleLock: () => void;
}

export function RoomControls({
  roomId,
  isLocked,
  onToggleLock,
}: RoomControlsProps) {
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const blocks = useQuery(api.rooms.getWorkspaceBlocks, { roomId }) ?? [];
  const presets = useQuery(api.rooms.getPresets, { roomId }) ?? [];

  const clearWorkspace = useMutation(api.blocks.clearWorkspace);
  const savePreset = useMutation(api.presets.savePreset);
  const loadPreset = useMutation(api.presets.loadPreset);
  const deletePreset = useMutation(api.presets.deletePreset);

  const handleClear = async () => {
    try {
      await clearWorkspace({ roomId });
      setShowConfirmClear(false);
    } catch (error) {
      console.error("Failed to clear workspace:", error);
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;

    try {
      await savePreset({
        roomId,
        name: presetName.trim(),
        blocks: blocks.map((b, i) => ({
          text: b.text,
          category: b.category,
          order: i,
        })),
      });
      setPresetName("");
      setShowPresetModal(false);
    } catch (error) {
      console.error("Failed to save preset:", error);
    }
  };

  const handleLoadPreset = async (presetId: Id<"presets">) => {
    try {
      await loadPreset({ roomId, presetId });
    } catch (error) {
      console.error("Failed to load preset:", error);
    }
  };

  const handleDeletePreset = async (presetId: Id<"presets">) => {
    try {
      await deletePreset({ presetId });
    } catch (error) {
      console.error("Failed to delete preset:", error);
    }
  };

  return (
    <div className="room-controls">
      <div className="control-buttons">
        <button
          className={`control-btn ${isLocked ? "locked" : ""}`}
          onClick={onToggleLock}
          title={isLocked ? "Unlock workspace" : "Lock workspace"}
        >
          {isLocked ? "Unlock" : "Lock"}
        </button>

        <button
          className="control-btn clear-btn"
          onClick={() => setShowConfirmClear(true)}
          disabled={isLocked || blocks.length === 0}
        >
          Clear
        </button>

        <button
          className="control-btn"
          onClick={() => setShowPresetModal(true)}
          disabled={blocks.length === 0}
        >
          Save Preset
        </button>

        {presets.length > 0 && (
          <select
            className="preset-select"
            onChange={(e) => {
              if (e.target.value) {
                handleLoadPreset(e.target.value as Id<"presets">);
                e.target.value = "";
              }
            }}
            disabled={isLocked}
            defaultValue=""
          >
            <option value="" disabled>
              Load Preset...
            </option>
            {presets.map((preset) => (
              <option key={preset._id} value={preset._id}>
                {preset.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="modal-overlay" onClick={() => setShowConfirmClear(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Clear Workspace?</h3>
            <p>This will remove all blocks from the workspace.</p>
            <div className="modal-buttons">
              <button
                className="modal-btn cancel"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="modal-overlay" onClick={() => setShowPresetModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Save Preset</h3>
            <input
              type="text"
              className="preset-input"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-btn cancel"
                onClick={() => setShowPresetModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
              >
                Save
              </button>
            </div>

            {presets.length > 0 && (
              <div className="existing-presets">
                <h4>Existing Presets</h4>
                <ul>
                  {presets.map((preset) => (
                    <li key={preset._id}>
                      <span>{preset.name}</span>
                      <button
                        className="delete-preset-btn"
                        onClick={() => handleDeletePreset(preset._id)}
                        title="Delete preset"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
