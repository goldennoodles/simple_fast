import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './TimerDisplay';
import OverDurationDisplay from './OverDurationDisplay';
import DurationInput from './DurationInput';
import ActionButton from './ActionButton';
import EditCurrentFastModal from './EditCurrentFastModal';
import { parseDuration } from '../../utils/time';
import { useFastingNotifications } from '../../hooks/useFastingNotifications';

interface FastingTimerProps {
    onStart: (startTime: Date, durationSeconds: number) => void;
    onEnd: (endTime: Date) => void;
    isFasting: boolean;
    startTime: Date | null;
    fastingDurationSeconds: number;
}

const FastingTimer: React.FC<FastingTimerProps & { onEditTime: (field: "start" | "end", newTime: Date) => void }> = ({
    onStart,
    onEnd,
    isFasting,
    startTime,
    fastingDurationSeconds,
    onEditTime,
}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [inputDuration, setInputDuration] = useState('48:00'); // default 8 hours in HH:mm format
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editField, setEditField] = useState<"start" | "end">("start");
    const intervalRef = useRef<number | null>(null);
    const notificationId = 1;

    // Use the fasting notifications hook to handle milestone notifications
    useFastingNotifications({
        startTime,
        fastingDurationSeconds,
        elapsedSeconds,
        isFasting,
    });

    function formatDateTime(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month} ${hours}:${minutes}`;
    }



    function formatGoalDuration(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    }

    useEffect(() => {
        if (isFasting && startTime) {
            const updateElapsed = () => {
                const now = new Date();
                const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setElapsedSeconds(diff);
            };
            updateElapsed();
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
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

    const handleEditClick = (field: "start" | "end") => {
        setEditField(field);
        setIsEditModalOpen(true);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleModalSave = (newTime: Date) => {
        onEditTime(editField, newTime);
        setIsEditModalOpen(false);
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem', position: 'relative', marginTop: '1rem' }}>
            <TimerDisplay elapsedSeconds={elapsedSeconds} progressPercent={progressPercent} isOverGoal={isOverGoal} />
            {isOverGoal && (
                <OverDurationDisplay overSeconds={elapsedSeconds - fastingDurationSeconds} />
            )}
            {!isFasting && (
                <>
                    <DurationInput inputDuration={inputDuration} onDurationChange={handleDurationChange} />
                </>
            )}

            {isFasting && (
                <>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.50rem' }}>
                        Goal: {formatGoalDuration(fastingDurationSeconds)}
                    </div>
                    <div style={{ fontSize: '1rem', color: '#555', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.50rem' }}>
                            <span style={{ fontSize: '1.0rem', fontWeight: '600' }}>Start: </span>
                            <span style={{ marginLeft: '0.5rem' }}>{startTime ? formatDateTime(startTime) : '--:--'}</span>
                            <button
                                type="button"
                                onClick={() => handleEditClick("start")}
                                style={{
                                    marginLeft: '1rem',
                                    fontSize: '0.85rem',
                                    padding: '0.25rem 0.6rem',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    border: '1px solid #2980f3',
                                    backgroundColor: 'white',
                                    color: '#2980f3',
                                    minWidth: '60px',
                                }}
                            >
                                Edit
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.0rem', fontWeight: '600' }}>End: </span>
                            <span style={{ marginLeft: '0.5rem' }}>{startTime ? formatDateTime(new Date(startTime.getTime() + fastingDurationSeconds * 1000)) : '--:--'}</span>
                            <button
                                type="button"
                                onClick={() => handleEditClick("end")}
                                style={{
                                    marginLeft: '1.43rem',
                                    fontSize: '0.85rem',
                                    padding: '0.25rem 0.6rem',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    border: '1px solid #2980f3',
                                    backgroundColor: 'white',
                                    color: '#2980f3',
                                    minWidth: '60px',
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </>
            )}
            <ActionButton isFasting={isFasting} onStartClick={handleStartClick} onEndClick={handleEndClick} isOverGoal={isOverGoal} />
            {!isFasting && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('08:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        8h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('16:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        16h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('24:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        24h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDurationChange('48:00')}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        48h
                    </button>
                </div>
            )}
            <EditCurrentFastModal
                open={isEditModalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
                startTime={startTime ?? new Date()}
                endTime={startTime ? new Date(startTime.getTime() + fastingDurationSeconds * 1000) : new Date()}
                editField={editField}
            />
        </div>
    );
};

export default FastingTimer;
