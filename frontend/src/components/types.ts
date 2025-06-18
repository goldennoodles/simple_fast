export interface FastingSession {
    id: string;
    startTime: Date;
    endTime: Date | null;
    mood: string | null;
    goalDurationSeconds?: number;
}
