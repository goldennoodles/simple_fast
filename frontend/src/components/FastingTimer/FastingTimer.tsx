import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './TimerDisplay';
import OverDurationDisplay from './OverDurationDisplay';
import DurationInput from './DurationInput';
import ActionButton from './ActionButton';
import { parseDuration } from '../../utils/time';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    const [inputDuration, setInputDuration] = useState('48:00'); // default 8 hours in HH:mm format
    const intervalRef = useRef<number | null>(null);
    const notificationId = 1;

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
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.25rem' }}>
                    Goal: {formatGoalDuration(fastingDurationSeconds)}
                </div>
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
        </div>
    );
};

export default FastingTimer;
