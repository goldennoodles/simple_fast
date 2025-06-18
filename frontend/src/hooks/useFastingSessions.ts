import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FastingSession {
    id: string;
    startTime: Date;
    endTime: Date | null;
    mood: string | null;
    goalDurationSeconds?: number;
}

export function useFastingSessions() {
    const [isFasting, setIsFasting] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [sessions, setSessions] = useState<FastingSession[]>([]);
    const [currentFastingDurationSeconds, setCurrentFastingDurationSeconds] = useState<number | null>(null);

    const handleStart = (time: Date, durationSeconds: number) => {
        setIsFasting(true);
        setStartTime(time);
        setCurrentFastingDurationSeconds(durationSeconds);
        setSelectedMood(null);
    };

    const handleEnd = (time: Date) => {
        setIsFasting(false);
        const newSession: FastingSession = {
            id: uuidv4(),
            startTime: startTime || time,
            endTime: time,
            mood: selectedMood,
            goalDurationSeconds: currentFastingDurationSeconds ?? undefined,
        };
        setSessions((prevSessions) => [newSession, ...prevSessions]);
        setStartTime(null);
        setSelectedMood(null);
        setCurrentFastingDurationSeconds(null);
    };

    const handleEditTime = (field: "start" | "end", newTime: Date) => {
        if (!startTime) return;

        if (field === "start") {
            // Update startTime and keep fasting duration the same
            setStartTime(newTime);
        } else if (field === "end") {
            // Zero out seconds and milliseconds in startTime for accurate duration calculation
            const startTimeZeroed = new Date(
                startTime.getFullYear(),
                startTime.getMonth(),
                startTime.getDate(),
                startTime.getHours(),
                startTime.getMinutes(),
                0,
                0
            );
            // Update fastingDurationSeconds based on new end time and zeroed startTime
            const newDurationSeconds = Math.max(0, Math.round((newTime.getTime() - startTimeZeroed.getTime()) / 1000));
            setCurrentFastingDurationSeconds(newDurationSeconds);
        }
    };

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
    };

    const handleDeleteSession = (id: string) => {
        setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
    };

    const handleEditSession = (updatedSession: FastingSession) => {
        setSessions((prevSessions) =>
            prevSessions.map((session) => (session.id === updatedSession.id ? updatedSession : session))
        );
    };

    return {
        isFasting,
        startTime,
        selectedMood,
        sessions,
        currentFastingDurationSeconds,
        handleStart,
        handleEnd,
        handleEditTime,
        handleMoodSelect,
        handleDeleteSession,
        handleEditSession,
        setSessions,
        setIsFasting,
        setStartTime,
        setSelectedMood,
        setCurrentFastingDurationSeconds,
    };
}
