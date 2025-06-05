import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import TimerDisplay from './TimerDisplay';
import OverDurationDisplay from './OverDurationDisplay';
import DurationInput from './DurationInput';
import ActionButton from './ActionButton';
import { parseDuration } from '../../utils/time';

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
    const [inputDuration, setInputDuration] = useState('08:00:00'); // default 8 hours in HH:mm:ss format
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

    const handleStartClick = () => {
        const durationSeconds = parseDuration(inputDuration);
        onStart(new Date(), durationSeconds);
    };

    const handleEndClick = () => {
        onEnd(new Date());
    };

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputDuration(e.target.value);
    };

    // Calculate progress percentage for progress bar
    const progressPercent = fastingDurationSeconds && fastingDurationSeconds > 0
        ? Math.min((elapsedSeconds / fastingDurationSeconds) * 100, 100)
        : 0;

    return (
        <div style={{ textAlign: 'center', padding: '1rem', position: 'relative' }}>
            <TimerDisplay elapsedSeconds={elapsedSeconds} progressPercent={progressPercent} />
            {isFasting && elapsedSeconds > fastingDurationSeconds && (
                <OverDurationDisplay overSeconds={elapsedSeconds - fastingDurationSeconds} />
            )}
            {!isFasting && (
                <DurationInput inputDuration={inputDuration} onDurationChange={handleDurationChange} />
            )}
            <ActionButton isFasting={isFasting} onStartClick={handleStartClick} onEndClick={handleEndClick} />
        </div>
    );
};

export default FastingTimer;
