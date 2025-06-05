import React from 'react';

interface ActionButtonProps {
    isFasting: boolean;
    onStartClick: () => void;
    onEndClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ isFasting, onStartClick, onEndClick }) =>
    !isFasting ? (
        <button onClick={onStartClick} style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
            Start Fast
        </button>
    ) : (
        <button
            onClick={onEndClick}
            style={{
                fontSize: '1.5rem',
                padding: '0.5rem 1rem',
                marginTop: '1rem',
                display: 'block',
                width: '100%',
                maxWidth: '200px',
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        >
            End Fast
        </button>
    );

export default ActionButton;
