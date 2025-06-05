import React from 'react';

interface FastingSession {
    id: number;
    startTime: Date;
    endTime: Date | null;
    mood: string | null;
}

interface FastingHistoryProps {
    sessions: FastingSession[];
}

const FastingHistory: React.FC<FastingHistoryProps> = ({ sessions }) => {
    return (
        <div
            style={{
                padding: '1rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                marginTop: '2rem',
            }}
        >
            <h2
                style={{
                    fontWeight: '700',
                    fontSize: '1.75rem',
                    marginBottom: '1rem',
                    color: '#2c3e50',
                    textAlign: 'center',
                }}
            >
                Fasting History
            </h2>
            {sessions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                    No fasting sessions recorded yet.
                </p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {sessions.map((session) => {
                        const durationSeconds = session.endTime
                            ? Math.floor(
                                (new Date(session.endTime).getTime() -
                                    new Date(session.startTime).getTime()) /
                                1000
                            )
                            : null;

                        const formatDuration = (totalSeconds: number) => {
                            const hours = Math.floor(totalSeconds / 3600);
                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                            return `${hours}h ${minutes}m`;
                        };

                        return (
                            <li
                                key={session.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: '#f0f4f8',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#34495e',
                                    }}
                                >
                                    <span>Start:</span>
                                    <span>{new Date(session.startTime).toLocaleString()}</span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#34495e',
                                    }}
                                >
                                    <span>End:</span>
                                    <span>
                                        {session.endTime
                                            ? new Date(session.endTime).toLocaleString()
                                            : 'Ongoing'}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#34495e',
                                    }}
                                >
                                    <span>Duration:</span>
                                    <span>
                                        {durationSeconds !== null
                                            ? formatDuration(durationSeconds)
                                            : 'In progress'}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontWeight: '600',
                                        color: '#34495e',
                                    }}
                                >
                                    <span>Mood:</span>
                                    <span>{session.mood || 'Not recorded'}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FastingHistory;
