export interface SignalRError extends Error {
    context?: any;
    transport?: string;
    soruce?: string;
}