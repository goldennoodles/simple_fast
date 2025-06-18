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
                display: "inline-block",
                backgroundColor: "#2980f3",
                color: "white",
                border: "2px solid white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                lineHeight: "28px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 0 0 2px #2980f3",
                userSelect: "none",
                marginBottom: "0.5rem",
            }}
            title={`Current fasting streak: ${streak}`}
            aria-label={`Current fasting streak: ${streak}`}
        >
            {streak}
        </div>
    );
};

export default StreakCounter;
