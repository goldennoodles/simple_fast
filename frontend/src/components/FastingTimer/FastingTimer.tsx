import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './TimerDisplay';
import OverDurationDisplay from './OverDurationDisplay';
import DurationInput from './DurationInput';
import ActionButton from './ActionButton';
import EditCurrentFastModal from './EditCurrentFastModal';
import { parseDuration } from '../../utils/time';
import { LocalNotifications } from '@capacitor/local-notifications';

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

    function formatDateTime(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month} ${hours}:${minutes}`;
    }

    async function requestNotificationPermission() {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
            return true;
        } else {
            console.warn('Notification permission not granted');
            return false;
        }
    }

    async function scheduleNotification(startTime: Date, durationSeconds: number) {
        const notifyTime = new Date(startTime.getTime() + durationSeconds * 1000);

        const now = new Date();
        if (notifyTime <= now) {
            console.log("Notification time is in the past. Not scheduling notification.");
            return;
        }

        console.log("Notify Time Set To:" + notifyTime)
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: notificationId,
                    title: 'Fasting Goal Reached!',
                    body: 'Congratulations, you have met your fasting goal.',
                    schedule: { at: notifyTime },

                    sound: undefined,
                    attachments: undefined,
                    actionTypeId: '',
                    extra: undefined,
                },
            ],
        });
    }

    async function cancelNotification() {
        console.log("Cancelling Notificaiton")
        await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
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

    useEffect(() => {
        if (isFasting && startTime && fastingDurationSeconds > 0) {
            requestNotificationPermission().then((granted) => {
                if (granted) {
                    scheduleNotification(startTime, fastingDurationSeconds);
                }
            });
        } else {
            cancelNotification();
        }
    }, [isFasting, startTime, fastingDurationSeconds]);

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
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.25rem' }}>
                        Goal: {formatGoalDuration(fastingDurationSeconds)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
                        Start: {startTime ? formatDateTime(startTime) : '--:--'}{' '}
                        <button
                            type="button"
                            onClick={() => handleEditClick("start")}
                            style={{
                                marginLeft: '0.5rem',
                                fontSize: '0.75rem',
                                padding: '0.15rem 0.4rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                border: '1px solid #2980f3',
                                backgroundColor: 'white',
                                color: '#2980f3',
                            }}
                        >
                            Edit
                        </button>
                        <br />
                        End: {startTime ? formatDateTime(new Date(startTime.getTime() + fastingDurationSeconds * 1000)) : '--:--'}{' '}
                        <button
                            type="button"
                            onClick={() => handleEditClick("end")}
                            style={{
                                marginLeft: '0.5rem',
                                fontSize: '0.75rem',
                                padding: '0.15rem 0.4rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                border: '1px solid #2980f3',
                                backgroundColor: 'white',
                                color: '#2980f3',
                            }}
                        >
                            Edit
                        </button>
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
