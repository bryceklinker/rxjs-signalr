import { toSignalRState } from './signalr-state';

describe('SignalRState', () => {
    it('should convert Connected to "connected"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Connected);
        expect(strState).toEqual('connected');
    });

    it('should convert Disconnected to "disconnected"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Disconnected);
        expect(strState).toEqual('disconnected');
    })

    it('should convert Reconnecting to "reconnecting"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Reconnecting);
        expect(strState).toEqual('reconnecting');
    })

    it('should convert Connecting to "connecting"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Connecting);
        expect(strState).toEqual('connecting');
    })
})