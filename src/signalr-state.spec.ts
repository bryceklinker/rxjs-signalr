import { expect } from 'chai';

import { toSignalRState } from "./signalr-state";

describe('SignalRState', () => {
    it('should convert Connected to "connected"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Connected);
        expect(strState).to.equal('connected');
    });

    it('should convert Disconnected to "disconnected"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Disconnected);
        expect(strState).to.equal('disconnected');
    })

    it('should convert Reconnecting to "reconnecting"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Reconnecting);
        expect(strState).to.equal('reconnecting');
    })

    it('should convert Connecting to "connecting"', () => {
        const strState = toSignalRState(SignalR.ConnectionState.Connecting);
        expect(strState).to.equal('connecting');
    })
})