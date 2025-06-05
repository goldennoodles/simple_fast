import React from 'react';
import { formatTime } from '../../utils/time';

interface TimerDisplayProps {
    elapsedSeconds: number;
    progressPercent: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedSeconds, progressPercent }) => (
    <svg
        width="150"
        height="150"
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
            stroke="#4caf50"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease', stroke: '#4caf50' }}
        />
        <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="12"
            fill="#333"
        >
            {formatTime(elapsedSeconds)}
        </text>
    </svg>
);

export default TimerDisplay;
