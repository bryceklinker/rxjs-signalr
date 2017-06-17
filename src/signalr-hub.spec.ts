import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { SignalRHub } from './signalr-hub';
import { SignalRState } from "./signalr-state";

declare var global: any;

describe('SignalRHub', () => {
    let proxy: SignalR.Hub.Proxy;
    let connection: SignalR.Hub.Connection;
    let connectionStartStub: sinon.SinonStub;
    let hubConnectionStub: sinon.SinonStub;
    let consoleWarnStub: sinon.SinonStub;

    beforeEach(() => {
        connection = $.hubConnection();
        proxy = connection.createHubProxy('na');

        sinon.stub(connection, 'start').callsFake(connectionStartFake);
        sinon.stub(connection, 'createHubProxy').returns(proxy);

        hubConnectionStub = sinon.stub($, 'hubConnection');
        hubConnectionStub.returns(connection);

        consoleWarnStub = sinon.stub(console, 'warn');
    })

    it('should create hub connection', () => {
        const hub = new SignalRHub('');
        expect(hub.connection).to.not.be.null;
        expect($.hubConnection).to.have.been.calledOnce;
    });

    it('should create proxy for hub', () => {
        const hub = new SignalRHub('somehub');
        expect(hub.proxy).to.not.be.null;
        expect(connection.createHubProxy).to.have.been.calledWith('somehub');
    });

    it('should start the connection', () => {
        const hub = new SignalRHub('something');
        hub.start();
        expect(connection.start).to.have.been.calledOnce;
    });

    it('should push received data to observers', (done) => {
        let onCallback;
        sinon.stub(proxy, 'on').callsFake((event, callback) => onCallback = callback);

        const hub = new SignalRHub('help');
        hub.on<{}>('something').subscribe((data) => {
            expect(data).to.eql({ id: 'one' });
            done();
        });
        onCallback({ id: 'one' });
    });

    it('should warn that no subscriptions have been registered', () => {
        const hub = new SignalRHub('bob');
        hub.start();
        expect(console.warn).to.have.been.calledOnce;
    });

    it('should not warn that no subscriptions have been registered', () => {
        const hub = new SignalRHub('one');
        hub.on<any>('stuff');
        hub.start();
        expect(console.warn).not.to.have.been.called;
    });

    it('should send data to proxy', () => {
        sinon.stub(proxy, 'invoke');

        const hub = new SignalRHub('bob');
        hub.start();
        hub.send<any>('method', { data: 'one' });
        expect(proxy.invoke).to.have.been.calledWith('method', { data: 'one' });
    });

    it('should notify of state change', (done) => {
        let stateChange;
        sinon.stub(connection, 'stateChanged').callsFake((callback) => stateChange = callback);

        const hub = new SignalRHub('bob');
        hub.start();
        hub.state$.subscribe((state: string) => {
            expect(state).to.equal(SignalRState.connected);
            done();
        });
        
        stateChange({ newState: SignalR.ConnectionState.Connected });
    });

    it('should notify of errors', (done) => {
        let errorCallback;
        sinon.stub(connection, 'error').callsFake((callback) => errorCallback = callback);

        const hub = new SignalRHub('one');
        hub.start();
        hub.error$.subscribe((error) => {
            expect(error).to.eql({});
            done();
        });
        errorCallback({});
    });

    afterEach(() => {
        hubConnectionStub.restore();
        consoleWarnStub.restore();
    });

    function connectionStartFake(): JQueryPromise<any> {
        return $.Deferred().resolve();
    }
})