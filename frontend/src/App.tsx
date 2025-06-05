import React, { useState } from 'react';
import MoodTracker from './components/MoodTracker';
import FastingTimer from './components/FastingTimer';
import FastingHistory from './components/FastingHistory';

interface FastingSession {
  id: number;
  startTime: Date;
  endTime: Date | null;
  mood: string | null;
}

const App: React.FC = () => {
  const [isFasting, setIsFasting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sessions, setSessions] = useState<FastingSession[]>([]);

  const handleStart = (time: Date) => {
    setIsFasting(true);
    setStartTime(time);
    setSelectedMood(null);
  };

  const handleEnd = (time: Date) => {
    setIsFasting(false);
    const newSession: FastingSession = {
      id: sessions.length + 1,
      startTime: startTime || time,
      endTime: time,
      mood: selectedMood,
    };
    setSessions([newSession, ...sessions]);
    setStartTime(null);
    setSelectedMood(null);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div style={{
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
    }}>
      <h1 style={{
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#2c3e50',
        width: '100%',
      }}>Fasting App</h1>
      <FastingTimer
        isFasting={isFasting}
        startTime={startTime}
        fastingDurationSeconds={isFasting && startTime ? sessions.length > 0 && sessions[0].startTime === startTime ? (sessions[0].endTime ? Math.floor((new Date(sessions[0].endTime).getTime() - new Date(sessions[0].startTime).getTime()) / 1000) : 0) : 0 : 0}
        onStart={handleStart}
        onEnd={handleEnd}
      />
      <div style={{ minHeight: '120px', width: '100%', maxHeight: 'none', overflow: 'visible' }}>
        {isFasting && (
          <>
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
          </>
        )}
      </div>
      <div style={{ flexGrow: 1, width: '100%', overflowY: 'auto', marginTop: '1rem' }}>
        <FastingHistory sessions={sessions} />
      </div>
    </div>
  );
};

export default App;
