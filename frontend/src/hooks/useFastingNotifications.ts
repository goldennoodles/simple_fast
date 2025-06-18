import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

interface Milestone {
    percent: number;
    message: string;
}

interface UseFastingNotificationsParams {
    startTime: Date | null;
    fastingDurationSeconds: number;
    elapsedSeconds: number;
    isFasting: boolean;
}

const milestones: Milestone[] = [
    { percent: 20, message: "20% of the way there! Good Job!" },
    { percent: 50, message: "Wow! You're half way there! Don't give up!" },
    { percent: 80, message: "You're so close, not long now to go!" },
    { percent: 100, message: "Congratulations! You've completed your fast!" },
];

export function useFastingNotifications({
    startTime,
    fastingDurationSeconds,
    elapsedSeconds,
    isFasting,
}: UseFastingNotificationsParams) {
    const sentMilestonesRef = useRef<Set<number>>(new Set());
    const notificationIdRef = useRef(1);
    const prevStartTimeRef = useRef<Date | null>(null);

    async function requestNotificationPermission() {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
            return true;
        } else {
            console.warn('Notification permission not granted');
            return false;
        }
    }

    async function sendNotification(title: string, body: string) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: notificationIdRef.current++,
                    title,
                    body,
                    schedule: { at: new Date() },
                },
            ],
        });
    }

    async function scheduleMilestoneNotifications() {
        if (!startTime || fastingDurationSeconds <= 0) return;

        console.log(`scheduleMilestoneNotifications called with startTime: ${startTime.toISOString()}, fastingDurationSeconds: ${fastingDurationSeconds}, elapsedSeconds: ${elapsedSeconds}`);

        const now = new Date();
        const elapsed = elapsedSeconds;
        const total = fastingDurationSeconds;

        for (const milestone of milestones) {
            const milestoneElapsedSeconds = (total * milestone.percent) / 100;

            if (sentMilestonesRef.current.has(milestone.percent)) {
                console.log(`Milestone ${milestone.percent}% notification already sent, skipping.`);
                continue;
            }

            if (elapsed >= milestoneElapsedSeconds) {
                // Milestone passed, send immediate notification if not sent
                // But only send one notification if elapsed > total (100%)
                if (elapsed > total && milestone.percent !== 100) {
                    console.log(`Elapsed time exceeded total fasting duration, skipping milestone ${milestone.percent}% notification to avoid spam.`);
                    continue;
                }
                console.log(`Milestone ${milestone.percent}% passed, sending immediate notification.`);
                try {
                    await sendNotification(`Fasting Progress: ${milestone.percent}%`, milestone.message);
                    sentMilestonesRef.current.add(milestone.percent);
                } catch (error) {
                    console.error(`Failed to send immediate notification for ${milestone.percent}%:`, error);
                }
            } else {
                // Milestone upcoming, schedule notification
                const notifyTime = new Date(startTime.getTime() + milestoneElapsedSeconds * 1000);
                if (notifyTime > now) {
                    console.log(`Scheduling notification for ${milestone.percent}% at ${notifyTime.toISOString()}`);
                    try {
                        await scheduleNotification(notifyTime, milestone.percent, milestone.message);
                    } catch (error) {
                        console.error(`Failed to schedule notification for ${milestone.percent}%:`, error);
                    }
                } else {
                    console.log(`Skipping scheduling for ${milestone.percent}% because notifyTime is in the past.`);
                }
            }
        }
    }

    async function scheduleNotification(notifyTime: Date, percent: number, message: string) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: notificationIdRef.current++,
                    title: `Fasting Progress: ${percent}%`,
                    body: message,
                    schedule: { at: notifyTime },
                },
            ],
        });
    }

    async function scheduleFinalNotification() {
        if (!startTime || fastingDurationSeconds <= 0) return;

        const notifyTime = new Date(startTime.getTime() + fastingDurationSeconds * 1000);
        const now = new Date();
        if (notifyTime <= now) {
            console.log("Notification time is in the past. Not scheduling final notification.");
            return;
        }

        // Use the scheduleNotification method from FastingTimer.tsx for the final notification
        await scheduleNotification(notifyTime, 100, 'Congratulations, you have met your fasting goal.');
    }

    async function cancelAllNotifications() {
        await LocalNotifications.cancel({ notifications: [] });
        sentMilestonesRef.current.clear();
        notificationIdRef.current = 1;
    }

    useEffect(() => {
        async function manageNotifications() {
            console.log(`useFastingNotifications useEffect triggered with isFasting: ${isFasting}, startTime: ${startTime}, fastingDurationSeconds: ${fastingDurationSeconds}, elapsedSeconds: ${elapsedSeconds}`);

            if (!isFasting) {
                console.log('Fasting stopped or not started, cancelling notifications and clearing sent milestones.');
                await cancelAllNotifications();
                sentMilestonesRef.current.clear();
                return;
            }

            if (!startTime || fastingDurationSeconds <= 0) {
                console.log('Invalid startTime or fastingDurationSeconds, skipping scheduling.');
                return;
            }

            const granted = await requestNotificationPermission();
            if (!granted) {
                console.log('Notification permission not granted, skipping scheduling.');
                return;
            }

            // Only clear sent milestones and cancel notifications if startTime changed (new fast)
            if (startTime !== prevStartTimeRef.current) {
                await cancelAllNotifications();
                sentMilestonesRef.current.clear();
                console.log('New fast detected, cancelled all notifications and cleared sent milestones.');
                prevStartTimeRef.current = startTime;
            }

            // Schedule milestone notifications
            await scheduleMilestoneNotifications();

            // Schedule final notification
            await scheduleFinalNotification();
        }

        manageNotifications();

        // Cleanup on unmount or fasting end
        return () => {
            console.log('Cleaning up notifications on fasting end or unmount');
            cancelAllNotifications();
        };
    }, [isFasting, startTime, fastingDurationSeconds, elapsedSeconds]);
}
