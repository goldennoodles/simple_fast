import React from 'react';

const moodEmojis = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Neutral', emoji: '😐' },
    { label: 'Sad', emoji: '😞' },
    { label: 'Energetic', emoji: '⚡' },
    { label: 'Tired', emoji: '😴' },
];

interface MoodTrackerProps {
    onMoodSelect: (mood: string) => void;
    selectedMood: string | null;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSelect, selectedMood }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '1rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '0 1rem',
            }}
        >
            {moodEmojis.map(({ label, emoji }) => (
                <button
                    key={label}
                    onClick={() => onMoodSelect(label)}
                    style={{
                        fontSize: '2.5rem',
                        backgroundColor: selectedMood === label ? '#90caf9' : 'transparent',
                        border: '2px solid',
                        borderColor: selectedMood === label ? '#42a5f5' : 'transparent',
                        cursor: 'pointer',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        transition: 'background-color 0.3s, border-color 0.3s',
                        boxShadow: selectedMood === label ? '0 0 8px #42a5f5' : 'none',
                    }}
                    aria-label={label}
                    title={label}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default MoodTracker;
