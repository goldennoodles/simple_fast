import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';

interface FastingTimerProps {
  onStart: (startTime: Date, durationSeconds: number) => void;
  onEnd: (endTime: Date) => void;
  isFasting: boolean;
  startTime: Date | null;
  fastingDurationSeconds: number;
}

const FastingTimer: React.FC<FastingTimerProps> = ({
  onStart,
  onEnd,
  isFasting,
  startTime,
  fastingDurationSeconds,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [inputDuration, setInputDuration] = useState('08:00'); // default 8 hours in HH:mm format
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isFasting && startTime) {
      const updateElapsed = () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);
      };
      updateElapsed();
      intervalRef.current = window.setInterval(updateElapsed, 1000);
    } else {
      setElapsedSeconds(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFasting, startTime]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    const [hours, minutes] = inputDuration.split(':').map(Number);
    const durationSeconds = hours * 3600 + minutes * 60;
    onStart(new Date(), durationSeconds);
  };

  const handleEndClick = () => {
    onEnd(new Date());
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputDuration(e.target.value);
  };

  // Calculate progress percentage for progress bar
  const progressPercent = fastingDurationSeconds
    ? Math.min((elapsedSeconds / fastingDurationSeconds) * 100, 100)
    : 0;

  return (
    <div style={{ textAlign: 'center', padding: '1rem', position: 'relative' }}>
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
          strokeDashoffset={
            2 * Math.PI * 45 * (1 - progressPercent / 100)
          }
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
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
      {!isFasting && (
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fast-duration" style={{ marginRight: '0.5rem' }}>
            Fast Duration (HH:mm):
          </label>
          <input
            id="fast-duration"
            type="time"
            step="60"
            value={inputDuration}
            onChange={handleDurationChange}
            style={{ fontSize: '1rem', padding: '0.25rem' }}
          />
        </div>
      )}
      {!isFasting ? (
        <button onClick={handleStartClick} style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
          Start Fast
        </button>
      ) : (
        <button
          onClick={handleEndClick}
          style={{
            fontSize: '1.5rem',
            padding: '0.5rem 1rem',
            marginTop: '1rem',
            display: 'block',
            width: '100%',
            maxWidth: '200px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          End Fast
        </button>
      )}
    </div>
  );
};

export default FastingTimer;
