import * as $ from 'jquery';
import 'signalr';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SignalRError } from './signalr-error';
import { SignalRState, toSignalRState } from './signalr-state';

export class SignalRHub {
    private _connection: SignalR.Hub.Connection;
    private _proxy: SignalR.Hub.Proxy;
    private _state$: Subject<string>;
    private _error$: Subject<SignalRError>;
    private _subjects: { [name: string]: Subject<any> };

    get connection(): SignalR.Hub.Connection {
        return this._connection || (this._connection = this.createConnection());
    }

    get proxy(): SignalR.Hub.Proxy {
        return this._proxy || (this._proxy = this.connection.createHubProxy(this.hubName));
    }

    get hubName(): string {
        return this._hubName;
    }

    get state$(): Observable<string> {
        return this._state$;
    }

    get error$(): Observable<any> {
        return this._error$;
    }

    constructor(private _hubName: string, 
        private _url: string = null) {
        this._subjects = {};
        this._state$ = new Subject<string>();
        this._error$ = new Subject<SignalRError>();
    }

    start() {
        if(!this.hasSubscriptions())
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        this.connection.start();
    }

    on<T>(event: string): Observable<T> {
        const subject =  this.getOrCreateSubject<T>(event);
        this.proxy.on(event, (data: T) => subject.next(data))
        return subject;
    }

    send<T>(method: string, data: T) {
        this.proxy.invoke(method, data);
    }

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;                
            }
        }

        return false;
    }

    private getOrCreateSubject<T>(event: string): Subject<T> {
        return this._subjects[event] || (this._subjects[event] = new Subject<T>());
    }

    private createConnection(): SignalR.Hub.Connection {
        const connection = $.hubConnection(this._url);
        connection.error(err => this.onError(err));
        connection.stateChanged((state) => this.onStateChanged(state));
        return connection;
    }

    private onStateChanged(state: SignalR.StateChanged) {
        const newState = toSignalRState(state.newState);
        this._state$.next(newState);
    }
    
    private onError(error: SignalR.ConnectionError) {
        this._error$.next(error);
    }
}