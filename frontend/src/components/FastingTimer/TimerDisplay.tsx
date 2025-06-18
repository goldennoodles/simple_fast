import React from 'react';
import { formatTime } from '../../utils/time';

interface TimerDisplayProps {
    elapsedSeconds: number;
    progressPercent: number;
    isOverGoal?: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedSeconds, progressPercent, isOverGoal = false }) => {
    const progressColor = isOverGoal ? '#2196f3' : '#4caf50'; // blue if over goal, else green

    return (
        <svg
            width="200"
            height="200"
            viewBox="0 0 100 100"
            style={{ marginBottom: '1rem' }}
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#ddd"
                strokeWidth="10"
                fill="none"
            />
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke={progressColor}
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.5s ease', stroke: progressColor }}
            />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="14"
                fill="#333"
            >
                {formatTime(elapsedSeconds)}
            </text>
        </svg>
    );
};

export default TimerDisplay;
