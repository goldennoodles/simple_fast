import React from "react";
import type { FastingSession } from "../types";
import { formatDuration } from "../../utils/time";

interface FastingSessionListItemProps {
    session: FastingSession;
    onClick: () => void;
}

const FastingSessionListItem: React.FC<FastingSessionListItemProps> = ({
    session,
    onClick,
}) => {
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
            onClick={onClick}
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
                <span>{session.endTime ? new Date(session.endTime).toLocaleString() : "Ongoing"}</span>
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
                            ? `${formatDuration(durationSeconds)} / ${formatDuration(session.goalDurationSeconds)}`
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
};

export default FastingSessionListItem;
