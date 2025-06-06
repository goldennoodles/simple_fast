import React from 'react';
import MoodTracker from './MoodTracker';
import styles from './EmojiView.module.css';

interface EmojiViewProps {
    isFasting: boolean;
    selectedMood: string | null;
    onMoodSelect: (mood: string) => void;
}

const EmojiView: React.FC<EmojiViewProps> = ({ isFasting, selectedMood, onMoodSelect }) => {
    return (
        <div
            className={`${styles.emojiContainer} ${isFasting ? styles.emojiVisible : styles.emojiHidden}`}
        >
            <h3 className={styles.heading}>
                How are you feeling?
            </h3>
            <MoodTracker selectedMood={selectedMood} onMoodSelect={onMoodSelect} />
        </div>
    );
};

export default EmojiView;
