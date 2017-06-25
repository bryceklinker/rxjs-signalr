import { SignalRHub } from './signalr-hub';
import { createSignalRHub } from './signalr-hub-factory';

describe('SignalRHubFactory', () => {
    it('should create signalr hub', () => {
        const hub = createSignalRHub('one');
        expect(hub instanceof SignalRHub).toBeTruthy()
        ;
    });

    it('should create only one hub per hub name', () => {
        const hub1 = createSignalRHub('bob');
        const hub2 = createSignalRHub('bob');
        expect(hub2).toEqual(hub1);
    })

    it('should use url and hubname to create hub', () => {
        const hub = createSignalRHub('hub', 'http://google.com/signals');
        expect(hub.url).toBe('http://google.com/signals');
        expect(hub.hubName).toBe('hub');
    })
})