import React, { useState, useEffect } from 'react';
import { Storage } from '@capacitor/storage';
import MoodTracker from './components/MoodTracker';
import FastingTimer from './components/FastingTimer/FastingTimer';
import FastingHistory from './components/FastingHistory';

interface FastingSession {
  id: number;
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
    id: number;
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
    const loadState = async () => {
      try {
        const result = await Storage.get({ key: STORAGE_KEY });
        if (result.value) {
          const savedState: AppState = JSON.parse(result.value);
          setIsFasting(savedState.isFasting);
          setStartTime(savedState.startTime ? new Date(savedState.startTime) : null);
          setSelectedMood(savedState.selectedMood);
          setSessions(
            savedState.sessions.map((session) => ({
              ...session,
              startTime: new Date(session.startTime),
              endTime: session.endTime ? new Date(session.endTime) : null,
            }))
          );
          setCurrentFastingDurationSeconds(savedState.currentFastingDurationSeconds);
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
        await Storage.set({ key: STORAGE_KEY, value: JSON.stringify(stateToSave) });
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

  const handleEnd = (time: Date) => {
    setIsFasting(false);
    const newSession: FastingSession = {
      id: sessions.length + 1,
      startTime: startTime || time,
      endTime: time,
      mood: selectedMood,
      goalDurationSeconds: currentFastingDurationSeconds ?? undefined,
    };
    setSessions([newSession, ...sessions]);
    setStartTime(null);
    setSelectedMood(null);
    setCurrentFastingDurationSeconds(null);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleDeleteSession = (id: number) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
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
              marginTop: '1rem',
              marginBottom: '0.25rem',
              color: '#34495e',
              width: '100%',
            }}
          >
            How are you feeling?
          </h3>
          <MoodTracker selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
        </div>

        <div
          className={`history-animate ${isFasting ? 'history-down' : 'history-up'}`}
          style={{ transition: 'margin-top 0.5s cubic-bezier(0.4,0,0.2,1)', marginTop: isFasting ? '10px' : '0' }}
        >
          <FastingHistory sessions={sessions} onDeleteSession={handleDeleteSession} />
        </div>
      </div>
    </div>
  );
};

export default App;
