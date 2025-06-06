export interface FastingSession {
    id: number;
    startTime: Date;
    endTime: Date | null;
    mood: string | null;
    goalDurationSeconds?: number;
}
