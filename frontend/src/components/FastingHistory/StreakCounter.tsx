import React from "react";

interface StreakCounterProps {
    streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
    if (streak === 0) {
        return null; // Don't show the counter if streak is zero
    }

    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                backgroundColor: "#2980f3",
                color: "white",
                border: "2px solid white",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                lineHeight: "44px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                boxShadow: "0 0 0 2px #2980f3",
                userSelect: "none",
                marginBottom: "0.5rem",
            }}
            title={`Current fasting streak: ${streak}`}
            aria-label={`Current fasting streak: ${streak}`}
        >
            {streak}
            <span
                role="img"
                aria-label="lightning"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "2.5rem",
                    opacity: 0.1,
                    pointerEvents: "none",
                    userSelect: "none",
                    lineHeight: 1,
                }}
            >
                ⚡
            </span>
        </div>
    );
};

export default StreakCounter;
