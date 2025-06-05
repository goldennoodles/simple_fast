import React, { type ChangeEvent } from 'react';

interface DurationInputProps {
    inputDuration: string;
    onDurationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DurationInput: React.FC<DurationInputProps> = ({ inputDuration, onDurationChange }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="fast-duration" style={{ marginRight: '0.5rem' }}>
            Fast Duration (HH:mm:ss):
        </label>
        <input
            id="fast-duration"
            type="text"
            pattern="^\\d{1,3}(:[0-5]\\d){0,2}$"
            placeholder="e.g. 48:00:00"
            value={inputDuration}
            onChange={onDurationChange}
            style={{ fontSize: '1rem', padding: '0.25rem', width: '120px', textAlign: 'center' }}
        />
    </div>
);

export default DurationInput;
