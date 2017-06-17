export const connected = 'connected';
export const disconnected = 'disconnected';
export const connecting = 'connecting';
export const reconnecting = 'reconnecting';

export const SignalRState = {
    connected,
    connecting,
    disconnected,
    reconnecting
}

export function toSignalRState(state: SignalR.ConnectionState): string {
    switch(state) {
        case SignalR.ConnectionState.Connected:
            return connected;
        case SignalR.ConnectionState.Connecting:
            return connecting;
        case SignalR.ConnectionState.Disconnected:
            return disconnected;
        case SignalR.ConnectionState.Reconnecting:
            return reconnecting;
    }
}