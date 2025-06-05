import React from 'react';
import { formatTime } from '../../utils/time';

interface OverDurationDisplayProps {
    overSeconds: number;
}

const OverDurationDisplay: React.FC<OverDurationDisplayProps> = ({ overSeconds }) => (
    <div style={{ color: '#2196f3', fontWeight: 'bold', marginTop: '0.5rem' }}>
        {formatTime(overSeconds)}+
    </div>
);

export default OverDurationDisplay;
