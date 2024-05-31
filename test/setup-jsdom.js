// # setup-jsdom.js
import { JSDOM } from 'jsdom';

let dom = new JSDOM('', {
	location: 'https://www.whisthub.com',
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Element = dom.window.Element;
globalThis.SVGElement = dom.window.SVGElement;
