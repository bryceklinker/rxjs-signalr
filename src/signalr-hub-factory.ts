import { SignalRHub } from './signalr-hub';

const hubs: { [hub: string]: SignalRHub } = {};

export function createSignalRHub(hubName: string, url: string = undefined) : SignalRHub {
    return hubs[hubName] || (hubs[hubName] = new SignalRHub(hubName, url));
}