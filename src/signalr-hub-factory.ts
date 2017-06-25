import { SignalRHub } from './signalr-hub';

const hubs: SignalRHub[] = [];

export function createSignalRHub(hubName: string, url?: string) : SignalRHub {
    return getHub(hubName, url) || addHub(hubName, url);
}

function getHub(hubName:string, url: string) : SignalRHub {
    return hubs.filter(h => h.hubName === hubName && h.url === url)[0];
}

function addHub(hubName: string, url: string) : SignalRHub {
    const hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
}