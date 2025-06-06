import React, { useState, useEffect } from 'react';

interface DurationInputProps {
    inputDuration: string;
    onDurationChange: (duration: string) => void;
}

const DurationInput: React.FC<DurationInputProps> = ({ inputDuration, onDurationChange }) => {
    // Parse initial inputDuration into hours, minutes, seconds
    const parseDuration = (duration: string) => {
        const parts = duration.split(':');
        return {
            hours: parts[0] || '',
            minutes: parts[1] || '',
        };
    };

    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    useEffect(() => {
        const { hours, minutes } = parseDuration(inputDuration);
        setHours(hours);
        setMinutes(minutes);
    }, [inputDuration]);

    // Format duration string from parts
    const formatDuration = (h: string, m: string) => {
        const hh = h.padStart(1, '0');
        const mm = m.padStart(2, '0');
        return `${hh}:${mm}`;
    };

    // Handle input change with validation and auto-advance
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'hours' | 'minutes'
    ) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (type === 'hours') {
            if (val.length > 3) val = val.slice(0, 3);
            setHours(val);
            if (val.length === 3) {
                // Auto-advance to minutes input
                const next = document.getElementById('fast-minutes');
                if (next) next.focus();
            }
        } else {
            if (val.length > 2) val = val.slice(0, 2);
            if (type === 'minutes') {
                if (parseInt(val) > 59) val = '59';
                setMinutes(val);
                if (val.length === 2) {
                    // No next input to focus on since seconds removed
                }
            }
        }
        const newDuration = formatDuration(
            type === 'hours' ? val : hours,
            type === 'minutes' ? val : minutes
        );
        onDurationChange(newDuration);
    };

    return (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="fast-hours" style={{ marginRight: '0.5rem' }}>
                Fast Duration (Hour : Minute):
            </label>
            <input
                id="fast-hours"
                type="tel"
                inputMode="numeric"
                placeholder="HH"
                value={hours}
                onChange={(e) => handleChange(e, 'hours')}
                style={{ fontSize: '1rem', padding: '0.25rem', width: '40px', textAlign: 'center' }}
            />
            <span style={{ margin: '0 4px' }}>:</span>
            <input
                id="fast-minutes"
                type="tel"
                inputMode="numeric"
                placeholder="MM"
                value={minutes}
                onChange={(e) => handleChange(e, 'minutes')}
                style={{ fontSize: '1rem', padding: '0.25rem', width: '30px', textAlign: 'center' }}
            />
        </div>
    );
};

export default DurationInput;
