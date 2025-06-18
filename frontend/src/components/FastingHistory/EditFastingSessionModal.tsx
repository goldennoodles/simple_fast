import React, { useState, useEffect } from "react";
import MoodTracker from "../Mood/MoodTracker";
import DurationInput from "../FastingTimer/DurationInput";
import type { FastingSession } from "../types";

interface EditFastingSessionModalProps {
  session: FastingSession | null;
  onSave: (updatedSession: FastingSession) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const EditFastingSessionModal: React.FC<EditFastingSessionModalProps> = ({
  session,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [editedStartTime, setEditedStartTime] = useState<string>("");
  const [editedEndTime, setEditedEndTime] = useState<string>("");
  const [editedMood, setEditedMood] = useState<string>("");
  const [editedGoalDuration, setEditedGoalDuration] = useState<string>("00:00");

  useEffect(() => {
    if (session) {
      setEditedStartTime(session.startTime.toISOString().slice(0, 16));
      setEditedEndTime(session.endTime ? session.endTime.toISOString().slice(0, 16) : "");
      setEditedMood(session.mood || "");
      if (session.goalDurationSeconds !== undefined) {
        const hours = Math.floor(session.goalDurationSeconds / 3600);
        const minutes = Math.floor((session.goalDurationSeconds % 3600) / 60);
        setEditedGoalDuration(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        );
      } else {
        setEditedGoalDuration("00:00");
      }
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const handleSave = () => {
    // Parse HH:mm to seconds
    const [hoursStr, minutesStr] = editedGoalDuration.split(":");
    const goalDurationSeconds = parseInt(hoursStr) * 3600 + parseInt(minutesStr) * 60;

    const updatedSession: FastingSession = {
      ...session,
      startTime: new Date(editedStartTime),
      endTime: editedEndTime ? new Date(editedEndTime) : null,
      mood: editedMood,
      goalDurationSeconds: goalDurationSeconds > 0 ? goalDurationSeconds : undefined,
    };

    onSave(updatedSession);
  };

  const handleDelete = () => {
    onDelete(session.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            fontWeight: "700",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        >
          Edit Fasting Session
        </h3>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          Start Time:
        </label>
        <input
          type="datetime-local"
          value={editedStartTime}
          onChange={(e) => setEditedStartTime(e.target.value)}
          style={{
            width: "97%",
            marginBottom: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          End Time:
        </label>
        <input
          type="datetime-local"
          value={editedEndTime}
          onChange={(e) => setEditedEndTime(e.target.value)}
          style={{
            width: "97%",
            marginBottom: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          Mood:
        </label>
        <MoodTracker selectedMood={editedMood || null} onMoodSelect={setEditedMood} />
        <div
          style={{
            display: "flex",
            marginTop: "2rem"
          }}
        />
        <DurationInput inputDuration={editedGoalDuration} onDurationChange={setEditedGoalDuration} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={handleDelete}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Delete
          </button>
          <div>
            <button
              onClick={onCancel}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#bdc3c7",
                color: "#2c3e50",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
                marginRight: "0.5rem",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2980f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFastingSessionModal;
