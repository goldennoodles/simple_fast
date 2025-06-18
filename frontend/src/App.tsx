import React, { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { v4 as uuidv4 } from 'uuid';
import MoodTracker from './components/Mood/MoodTracker';
import FastingTimer from './components/FastingTimer/FastingTimer';
import FastingHistory from './components/FastingHistory/FastingHistory';

interface FastingSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  mood: string | null;
  goalDurationSeconds?: number;
}

const STORAGE_KEY = 'appState';

interface AppState {
  isFasting: boolean;
  startTime: string | null; // ISO string
  selectedMood: string | null;
  sessions: Array<{
    id: string;
    startTime: string;
    endTime: string | null;
    mood: string | null;
    goalDurationSeconds?: number;
  }>;
  currentFastingDurationSeconds: number | null;
}

const App: React.FC = () => {
  const [isFasting, setIsFasting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sessions, setSessions] = useState<FastingSession[]>([]);
  const [currentFastingDurationSeconds, setCurrentFastingDurationSeconds] = useState<number | null>(null);

  // Load state from storage on mount
  useEffect(() => {
    const isValidUUID = (id: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    const loadState = async () => {
      try {
        const result = await Preferences.get({ key: STORAGE_KEY });
        if (result.value) {
          const savedState: AppState = JSON.parse(result.value);
          setIsFasting(savedState.isFasting);
          setStartTime(savedState.startTime ? new Date(savedState.startTime) : null);
          setSelectedMood(savedState.selectedMood);

          let sessionsUpdated = false;
          const updatedSessions = savedState.sessions.map((session) => {
            let newId = session.id;
            if (!isValidUUID(session.id)) {
              newId = uuidv4();
              sessionsUpdated = true;
            }
            return {
              ...session,
              id: newId,
              startTime: new Date(session.startTime),
              endTime: session.endTime ? new Date(session.endTime) : null,
            };
          });

          setSessions(updatedSessions);
          setCurrentFastingDurationSeconds(savedState.currentFastingDurationSeconds);

          if (sessionsUpdated) {
            // Save updated sessions back to storage to prevent repeated migrations
            const stateToSave: AppState = {
              isFasting: savedState.isFasting,
              startTime: savedState.startTime,
              selectedMood: savedState.selectedMood,
              sessions: updatedSessions.map((session) => ({
                id: session.id,
                startTime: session.startTime.toISOString(),
                endTime: session.endTime ? session.endTime.toISOString() : null,
                mood: session.mood,
                goalDurationSeconds: session.goalDurationSeconds,
              })),
              currentFastingDurationSeconds: savedState.currentFastingDurationSeconds,
            };
            await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(stateToSave) });
          }
        }
      } catch (error) {
        console.error('Failed to load app state:', error);
      }
    };
    loadState();
  }, []);

  // Save state to storage on changes
  useEffect(() => {
    const saveState = async () => {
      try {
        const stateToSave: AppState = {
          isFasting,
          startTime: startTime ? startTime.toISOString() : null,
          selectedMood,
          sessions: sessions.map((session) => ({
            id: session.id,
            startTime: session.startTime.toISOString(),
            endTime: session.endTime ? session.endTime.toISOString() : null,
            mood: session.mood,
            goalDurationSeconds: session.goalDurationSeconds,
          })),
          currentFastingDurationSeconds,
        };
        await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(stateToSave) });
      } catch (error) {
        console.error('Failed to save app state:', error);
      }
    };
    saveState();
  }, [isFasting, startTime, selectedMood, sessions, currentFastingDurationSeconds]);

  const handleStart = (time: Date, durationSeconds: number) => {
    setIsFasting(true);
    setStartTime(time);
    setCurrentFastingDurationSeconds(durationSeconds);
    setSelectedMood(null);
  };

  const handleEnd = async (time: Date) => {
    setIsFasting(false);
    const newSession: FastingSession = {
      id: uuidv4(),
      startTime: startTime || time,
      endTime: time,
      mood: selectedMood,
      goalDurationSeconds: currentFastingDurationSeconds ?? undefined,
    };
    setSessions((prevSessions) => {
      const updatedSessions = [newSession, ...prevSessions];
      // No sorting, preserve insertion order
      return updatedSessions;
    });
    setStartTime(null);
    setSelectedMood(null);
    setCurrentFastingDurationSeconds(null);
  };

  const handleEditTime = (field: "start" | "end", newTime: Date) => {
    if (!startTime) return;

    if (field === "start") {
      // Update startTime and keep fasting duration the same
      const duration = currentFastingDurationSeconds ?? 0;
      setStartTime(newTime);
      // No change to fastingDurationSeconds, so end time changes accordingly
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

  // Pass handleEditTime to FastingTimer
  // In the return JSX:
  // <FastingTimer
  //   ...
  //   onEditTime={handleEditTime}
  // />

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
  };

  const handleEditSession = (updatedSession: FastingSession) => {
    setSessions((prevSessions) => {
      const updatedSessions = prevSessions.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      );
      // No sorting, preserve insertion order (user entry order)
      return updatedSessions;
    });
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        padding: '1rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        borderRadius: '0',
        boxShadow: 'none',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '2.5rem',
          marginTop: '6rem',
          marginBottom: '1rem',
          color: '#2c3e50',
          width: '100%',
        }}
      >
        SimpleFast
      </h1>
      <FastingTimer
        isFasting={isFasting}
        startTime={startTime}
        fastingDurationSeconds={isFasting ? currentFastingDurationSeconds ?? 0 : 0}
        onStart={handleStart}
        onEnd={handleEnd}
        onEditTime={handleEditTime}
      />

      <div style={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}>
        <div
          className="emoji-animate emoji-visible"
          style={{
            transition: 'opacity 0.5s ease, max-height 0.5s ease, padding 0.5s ease',
            opacity: isFasting ? 1 : 0,
            maxHeight: isFasting ? '200px' : '0',
            overflow: 'hidden',
            padding: isFasting ? '1rem 0' : '0',
            width: '100%',
          }}
        >
          <h3
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '1.1rem',
              marginTop: '0rem',
              marginBottom: '0.25rem',
              color: '#34495e',
              width: '100%',
            }}
          >
            {`How are you feeling?${selectedMood ? ' ' + selectedMood : ''}`}
          </h3>
          <MoodTracker selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
        </div>

        <div
          className={`history-animate ${isFasting ? 'history-down' : 'history-up'}`}
          style={{ transition: 'margin-top 0.5s cubic-bezier(0.4,0,0.2,1)', marginTop: isFasting ? '10px' : '0' }}
        >
          <FastingHistory sessions={sessions} onDeleteSession={handleDeleteSession} onEditSession={handleEditSession} />
        </div>
      </div>
    </div>
  );
};

export default App;
