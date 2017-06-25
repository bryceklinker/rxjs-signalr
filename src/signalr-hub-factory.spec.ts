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
        const hub = createSignalRHub('hub', '/signals');
        expect(hub.url).toBe('/signals');
        expect(hub.hubName).toBe('hub');
    })

    it('should create two hubs if url is different for each one', () => {
        const hub1 = createSignalRHub('jack');
        const hub2 = createSignalRHub('jack', '/other');
        expect(hub1.url).toBeNull();
        expect(hub2.url).toBe('/other');
    })
})