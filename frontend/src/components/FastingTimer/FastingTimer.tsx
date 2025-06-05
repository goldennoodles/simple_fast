import React, { useState, useEffect, useRef } from 'react';
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

    const handleStartClick = () => {
        const durationSeconds = parseDuration(inputDuration);
        onStart(new Date(), durationSeconds);
    };

    const handleEndClick = () => {
        onEnd(new Date());
    };

    const handleDurationChange = (duration: string) => {
        setInputDuration(duration);
    };

    // Calculate progress percentage for progress bar
    const progressPercent = fastingDurationSeconds && fastingDurationSeconds > 0
        ? Math.min((elapsedSeconds / fastingDurationSeconds) * 100, 100)
        : 0;

    const isOverGoal = isFasting && elapsedSeconds > fastingDurationSeconds;

    return (
        <div style={{ textAlign: 'center', padding: '1rem', position: 'relative' }}>
            <TimerDisplay elapsedSeconds={elapsedSeconds} progressPercent={progressPercent} isOverGoal={isOverGoal} />
            {isOverGoal && (
                <OverDurationDisplay overSeconds={elapsedSeconds - fastingDurationSeconds} />
            )}
            {!isFasting && (
                <>
                    <DurationInput inputDuration={inputDuration} onDurationChange={handleDurationChange} />
                </>
            )}
            <ActionButton isFasting={isFasting} onStartClick={handleStartClick} onEndClick={handleEndClick} isOverGoal={isOverGoal} />
            {!isFasting && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('08:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                        8h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('16:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                        16h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('24:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                        24h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('48:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                        48h
                    </button>
                </div>
            )}
        </div>
    );
};

export default FastingTimer;
