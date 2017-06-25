# Reactive Extensions wrapper for ASP.NET SignalR

When consuming SignalR based services I wanted to be able to treat receiving data as an observable stream. This library provides a thin wrapper to allow consumption of SignalR services using RxJS Observables.

## What is RxJS?

Refer to the [RxJS docs for that](https://github.com/ReactiveX/rxjs).

## What is SignalR?

Refer to the [ASP.NET SignalR docs](https://www.asp.net/signalr).

## Getting started

### jQuery and Signalr

This package relies on jquery and signalr packages. You will need to have both of them available to use this package.

#### Browser

Using this package in the browser will require the following script tags (assuming you are using npm)

```html
<html>
    <head></head>

    <body>
        <script src="../node_modules/jquery/dist/jquery.js"></script>
        <script src="../node_modules/signalr/jquery.signalR.js"></script>
    </body>
</html>
```

#### Webpack

Using this package with a webpack build system you can use the provide plugin for webpack to ensure jquery is resolved correctly.

```javascript
var webpack = require('webpack');

module.exports = {
    entry: ...
    output: ...
    plugins; [
        ...
        new wepback.ProvidePlugin({
            '$': 'jquery',
            'window.jQuery': 'jquery',
            'jQuery': 'jquery'
        })
        ...
    ]    
}
```

### Install

Install using npm:

```bash
npm install rxjs-signalr --save
```

### Creating a hub

Create using factory method:

```javascript
import { createSignalRHub } from 'rxjs-signalr';

const hub = createSignalRHub('{hubName}');
```

Create using constructor: 

```javascript
import { SignalRHub } from 'rxjs-signalr';

const hub = new SignalRHub('{hubName}');
```

### Receiving data from SignalR

```javascript
import { createSignalRHub } from 'rxjs-signalr';

const hub = createSignalRHub('{hubName}');
hub.on('{name of event/method}').subscribe(data => {
    // Perform logic here
});
hub.start();
```

### Sending data to SignalR

```javascript
import { createSignalRHub } from 'rxjs-signalr';

const hub = createSignalRHub('{hubName}');
hub.start();
hub.send('{name of event/method}', {});
```

### Responding to connection state changes

```javascript
import { createSignalRHub } from 'rxjs-signalr';

const hub = createSignalRHub('{hubName}');
hub.start();
hub.state$.subscribe(state => {
    // state will be a string value of: connected, connecting, dicsonnected, reconnecting.
    // Perform logic here
});
```