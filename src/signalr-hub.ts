import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class SignalRHub {
    private _connection: SignalR.Hub.Connection;
    private _proxy: SignalR.Hub.Proxy;
    private _subjects: { [name: string]: Subject<any> };

    get connection(): SignalR.Hub.Connection {
        return this._connection || (this._connection = $.hubConnection());
    }

    get proxy(): SignalR.Hub.Proxy {
        return this._proxy || (this._proxy = this.connection.createHubProxy(this.hubName));
    }

    get hubName(): string {
        return this._hubName;
    }

    constructor(private _hubName: string) {
        this._subjects = {};
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
}