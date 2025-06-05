import React from 'react';

interface ActionButtonProps {
    isFasting: boolean;
    onStartClick: () => void;
    onEndClick: () => void;
}

interface ActionButtonProps {
    isFasting: boolean;
    onStartClick: () => void;
    onEndClick: () => void;
    isOverGoal?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ isFasting, onStartClick, onEndClick, isOverGoal = false }) => {
    const buttonColor = isOverGoal ? '#2196f3' : '#4caf50'; // blue if over goal, else green

    return !isFasting ? (
        <button
            onClick={onStartClick}
            style={{
                fontSize: '1.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            }}
        >
            Start Fast
        </button>
    ) : (
        <button
            onClick={onEndClick}
            style={{
                fontSize: '1.5rem',
                padding: '0.5rem',
                marginTop: '1rem',
                display: 'block',
                width: '100%',
                maxWidth: '200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            }}
        >
            End Fast
        </button>
    );
};

export default ActionButton;
