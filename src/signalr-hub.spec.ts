import * as $ from 'jquery';
import 'signalr';

import { SignalRHub } from './signalr-hub';
import { SignalRState } from './signalr-state';

describe('SignalRHub', () => {
    let signalrUrl: string;
    let proxy: SignalR.Hub.Proxy;
    let connection: SignalR.Hub.Connection;
    let connectionStartStub: jasmine.Spy;
    let hubConnectionStub: jasmine.Spy;
    let consoleWarnStub: jasmine.Spy;

    beforeEach(() => {
        connection = $.hubConnection();
        proxy = connection.createHubProxy('na');

        spyOn(connection, 'start').and.callFake(connectionStartFake);
        spyOn(connection, 'createHubProxy').and.returnValue(proxy);

        hubConnectionStub = spyOn($, 'hubConnection');
        hubConnectionStub.and.callFake((url, opts) => {
            signalrUrl = url;
            return connection;
        });

        consoleWarnStub = spyOn(console, 'warn');
    })

    it('should create hub connection', () => {
        const hub = new SignalRHub('');
        expect(hub.connection).not.toBeNull();
        expect($.hubConnection).toHaveBeenCalled();
    });

    it('should create connection using url', () => {
        const hub = new SignalRHub('hub', 'http://somewhere.com/signalr');
        hub.start();
        expect(signalrUrl).toEqual('http://somewhere.com/signalr');
    })

    it('should create proxy for hub', () => {
        const hub = new SignalRHub('somehub');
        expect(hub.proxy).not.toBeNull();
        expect(connection.createHubProxy).toHaveBeenCalledWith('somehub');
    });

    it('should start the connection', () => {
        const hub = new SignalRHub('something');
        hub.start();
        expect(connection.start).toHaveBeenCalled();
    });

    it('should push received data to observers', (done) => {
        let onCallback;
        spyOn(proxy, 'on').and.callFake((event, callback) => onCallback = callback);

        const hub = new SignalRHub('help');
        hub.on<{}>('something').subscribe((data) => {
            expect(data).toEqual({ id: 'one' });
            done();
        });
        onCallback({ id: 'one' });
    });

    it('should warn that no subscriptions have been registered', () => {
        const hub = new SignalRHub('bob');
        hub.start();
        expect(console.warn).toHaveBeenCalled();
    });

    it('should not warn that no subscriptions have been registered', () => {
        const hub = new SignalRHub('one');
        hub.on<any>('stuff');
        hub.start();
        expect(console.warn).not.toHaveBeenCalled();
    });

    it('should send data to proxy', () => {
        spyOn(proxy, 'invoke');

        const hub = new SignalRHub('bob');
        hub.start();
        hub.send<any>('method', { data: 'one' });
        expect(proxy.invoke).toHaveBeenCalledWith('method', { data: 'one' });
    });

    it('should return data from proxy', async () => {
        spyOn(proxy, 'invoke').and.returnValue(Promise.resolve(42));

        const hub = new SignalRHub('bob');
        hub.start();
        var result = await hub.send<any>('method', { data: 'one' });
        
        expect(result).toBe(42);
        expect(proxy.invoke).toHaveBeenCalledWith('method', { data: 'one' });
    });

    it('should notify of state change', (done) => {
        let stateChange;
        spyOn(connection, 'stateChanged').and.callFake((callback) => stateChange = callback);

        const hub = new SignalRHub('bob');
        hub.start();
        hub.state$.subscribe((state: string) => {
            expect(state).toEqual(SignalRState.connected);
            done();
        });
        
        stateChange({ newState: SignalR.ConnectionState.Connected });
    });

    it('should notify of errors', (done) => {
        let errorCallback;
        spyOn(connection, 'error').and.callFake((callback) => errorCallback = callback);

        const hub = new SignalRHub('one');
        hub.start();
        hub.error$.subscribe((error) => {
            expect(error).toBeDefined();
            done();
        });
        errorCallback({});
    });

    function connectionStartFake(): JQueryPromise<any> {
        return $.Deferred().resolve();
    }
})