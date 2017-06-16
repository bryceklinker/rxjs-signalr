import { JSDOM } from 'jsdom';
import * as jQuery from 'jquery';

declare var global: any;
const doc = new JSDOM('<html><body></body></html>');
const window: any = doc.window;
window.jQuery = jQuery(window);
window.$ = window.jQuery;
global.window = window;
global.jQuery = window.jQuery;
global.$ = window.jQuery;

require('signalr');