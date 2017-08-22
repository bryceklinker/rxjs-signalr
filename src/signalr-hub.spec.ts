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

        connectionStartStub = spyOn(connection, 'start').and.callFake(connectionStartFake);
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

    it('should send data to proxy', async () => {
        spyOn(proxy, 'invoke').and.returnValue(Promise.resolve());;

        const hub = new SignalRHub('bob');
        hub.start();
        await hub.send('method', { data: 'one' });

        expect(connectionStartStub).toHaveBeenCalled();
        expect(proxy.invoke).toHaveBeenCalledWith('method', { data: 'one' });
    });

    it('should allow to invoke a server-side method without any parameters', async () => {
        spyOn(proxy, 'invoke').and.returnValue(Promise.resolve());;

        const hub = new SignalRHub('bob');
        hub.start();
        await hub.send('method');

        expect(connectionStartStub).toHaveBeenCalled();
        expect(proxy.invoke).toHaveBeenCalledWith('method');
    });

    it('should allow to invoke a server-side method with more than one parameter', async () => {
        spyOn(proxy, 'invoke').and.returnValue(Promise.resolve());;

        const hub = new SignalRHub('bob');
        hub.start();
        await hub.send('method', 1, 'Hello World', true);

        expect(connectionStartStub).toHaveBeenCalled();
        expect(proxy.invoke).toHaveBeenCalledWith('method', 1, 'Hello World', true);
    });


    it('should fail to send data to server if not started', async () => {
        spyOn(proxy, 'invoke');

        let errorMessage = '';
        const hub = new SignalRHub('bob');
        try {
            var result = await hub.send('method', { data: 'one' });
        } catch(error) {
            errorMessage = error; // We expect the promise to be rejected with a string as result. 
                                  // so we cannot use the default error assertion here, as that only
                                  // works with standard JavaScript errors.
        }
        
        expect(errorMessage).toBe('The connection has not been started yet. Please start the connection by invoking the start method befor attempting to send a message to the server.');
        expect(connectionStartStub).not.toHaveBeenCalled();
        expect(proxy.invoke).not.toHaveBeenCalled();
    });


    it('should return data from proxy', async () => {
        spyOn(proxy, 'invoke').and.returnValue(Promise.resolve(42));

        const hub = new SignalRHub('bob');
        hub.start();
        var result = await hub.send('method', { data: 'one' });
        
        expect(connectionStartStub).toHaveBeenCalled();
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