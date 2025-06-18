import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'appState';

export interface AppState {
    isFasting: boolean;
    startTime: string | null; // ISO string
    selectedMood: string | null;
    sessions: Array<{
        id: string;
        startTime: string;
        endTime: string | null;
        mood: string | null;
        goalDurationSeconds?: number;
    }>;
    currentFastingDurationSeconds: number | null;
}

export function useAppStatePersistence(
    state: AppState,
    setState: (state: AppState) => void
) {
    // Load state from storage on mount
    useEffect(() => {
        const loadState = async () => {
            try {
                const result = await Preferences.get({ key: STORAGE_KEY });
                if (result.value) {
                    const savedState: AppState = JSON.parse(result.value);
                    setState(savedState);
                }
            } catch (error) {
                console.error('Failed to load app state:', error);
            }
        };
        loadState();
    }, [setState]);

    // Save state to storage on changes
    useEffect(() => {
        const saveState = async () => {
            try {
                await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(state) });
            } catch (error) {
                console.error('Failed to save app state:', error);
            }
        };
        saveState();
    }, [state]);
}
