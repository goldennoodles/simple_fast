import React, { useState } from 'react';

interface FastingSession {
    id: number;
    startTime: Date;
    endTime: Date | null;
    mood: string | null;
    goalDurationSeconds?: number;
}

interface FastingHistoryProps {
    sessions: FastingSession[];
    onDeleteSession: (id: number) => void;
}

const FastingHistory: React.FC<FastingHistoryProps> = ({ sessions, onDeleteSession }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const openConfirmDialog = (id: number) => {
        setConfirmDeleteId(id);
    };

    const closeConfirmDialog = () => {
        setConfirmDeleteId(null);
    };

    const confirmDelete = () => {
        if (confirmDeleteId !== null) {
            onDeleteSession(confirmDeleteId);
            closeConfirmDialog();
        }
    };

    const formatDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

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

                        const isBelowGoal = durationSeconds !== null && session.goalDurationSeconds !== undefined && durationSeconds < session.goalDurationSeconds;
                        const isAboveOrEqualGoal = durationSeconds !== null && session.goalDurationSeconds !== undefined && durationSeconds >= session.goalDurationSeconds;

                        let durationColor = undefined;
                        if (isBelowGoal) {
                            durationColor = '#e74c3c'; // red
                        } else if (isAboveOrEqualGoal) {
                            durationColor = '#2980f3'; // blue
                        }

                        return (
                            <li
                                key={session.id}
                                onClick={() => openConfirmDialog(session.id)}
                                style={{
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: '#f0f4f8',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
                                    position: 'relative',
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
                                        color: durationColor || '#34495e',
                                    }}
                                >
                                    <span>Duration:</span>
                                    <span>
                                        {durationSeconds !== null
                                            ? session.goalDurationSeconds !== undefined
                                                ? `${formatDuration(durationSeconds)} / ${formatDuration(session.goalDurationSeconds)}`
                                                : formatDuration(durationSeconds)
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

            {confirmDeleteId !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.1rem' }}>
                            Are you sure you want to delete this fasting session?
                        </p>
                        <button
                            onClick={confirmDelete}
                            style={{
                                marginRight: '1rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={closeConfirmDialog}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#bdc3c7',
                                color: '#2c3e50',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FastingHistory;
