import React, { useState } from "react";
import EditFastingSessionModal from "./EditFastingSessionModal";
import type { FastingSession } from "../types";

interface FastingHistoryProps {
    sessions: FastingSession[];
    onDeleteSession: (id: number) => void;
    onEditSession: (updatedSession: FastingSession) => void;
}

const FastingHistory: React.FC<FastingHistoryProps> = ({
    sessions,
    onDeleteSession,
    onEditSession,
}) => {
    const [editSession, setEditSession] = useState<FastingSession | null>(null);

    const openEditDialog = (session: FastingSession) => {
        setEditSession(session);
    };

    const closeEditDialog = () => {
        setEditSession(null);
    };

    const handleDelete = (id: number) => {
        onDeleteSession(id);
        closeEditDialog();
    };

    const handleSave = (updatedSession: FastingSession) => {
        onEditSession(updatedSession);
        closeEditDialog();
    };

    const formatDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div
            style={{
                padding: "1rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                marginTop: "1rem",
            }}
        >
            <h2
                style={{
                    fontWeight: "700",
                    fontSize: "1.75rem",
                    marginBottom: "1rem",
                    color: "#2c3e50",
                    textAlign: "center",
                }}
            >
                Fasting History
            </h2>
            {sessions.length === 0 ? (
                <p style={{ textAlign: "center", color: "#7f8c8d" }}>
                    No fasting sessions recorded yet.
                </p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {sessions.map((session) => {
                        const durationSeconds = session.endTime
                            ? Math.floor(
                                (new Date(session.endTime).getTime() -
                                    new Date(session.startTime).getTime()) /
                                1000
                            )
                            : null;

                        const isBelowGoal =
                            durationSeconds !== null &&
                            session.goalDurationSeconds !== undefined &&
                            durationSeconds < session.goalDurationSeconds;
                        const isAboveOrEqualGoal =
                            durationSeconds !== null &&
                            session.goalDurationSeconds !== undefined &&
                            durationSeconds >= session.goalDurationSeconds;

                        let durationColor = undefined;
                        if (isBelowGoal) {
                            durationColor = "#e74c3c"; // red
                        } else if (isAboveOrEqualGoal) {
                            durationColor = "#2980f3"; // blue
                        }

                        return (
                            <li
                                key={session.id}
                                onClick={() => openEditDialog(session)}
                                style={{
                                    cursor: "pointer",
                                    border: "1px solid #ddd",
                                    borderRadius: "12px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    backgroundColor: "#f0f4f8",
                                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "0.5rem",
                                        fontWeight: "600",
                                        color: "#34495e",
                                    }}
                                >
                                    <span>Start:</span>
                                    <span>{new Date(session.startTime).toLocaleString()}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "0.5rem",
                                        fontWeight: "600",
                                        color: "#34495e",
                                    }}
                                >
                                    <span>End:</span>
                                    <span>
                                        {session.endTime
                                            ? new Date(session.endTime).toLocaleString()
                                            : "Ongoing"}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "0.5rem",
                                        fontWeight: "600",
                                        color: durationColor || "#34495e",
                                    }}
                                >
                                    <span>Duration:</span>
                                    <span>
                                        {durationSeconds !== null
                                            ? session.goalDurationSeconds !== undefined
                                                ? `${formatDuration(durationSeconds)} / ${formatDuration(
                                                    session.goalDurationSeconds
                                                )}`
                                                : formatDuration(durationSeconds)
                                            : "In progress"}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "600",
                                        color: "#34495e",
                                    }}
                                >
                                    <span>Mood:</span>
                                    <span>{session.mood || "Not recorded"}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <EditFastingSessionModal
                session={editSession}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={closeEditDialog}
            />
        </div>
    );
};

export default FastingHistory;
