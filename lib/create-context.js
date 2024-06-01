// # create-context.js
import { toValue } from 'vue';
import { $lookup } from './symbols.js';
import pickPlural from './pick-plural.js';

// # createContext(i18n, opts)
// Creates an i18n context, which is the object that holds the `t` function and 
// all other translation functionality. In vue-i18n this is called a *composer*, 
// but we call it a context for a lack of a better name.
export default function createContext(i18n, opts = {}) {

	// First of all we'll create the *lookup* function, which holds the logic of 
	// finding a *compiled* message in either the local or global messages. This 
	// is used for our `t` function obviously, but our <i18n-t> component also 
	// uses it under the hood to properly render its VNodes, just with a 
	// different render function!
	const { messages = {} } = opts;
	function lookup(key) {
		const locale = toValue(opts.locale) || toValue(i18n.locale);
		return searchMessage(i18n, messages, locale, key);
	}

	// Create the translation function `t` which uses `lookup` under the hood to 
	// find the message, and then applies the pluralization rules to it if 
	// needed.
	function t(key, count, args) {

		// Lookup the message based on the key and current locale.
		let message = lookup(key);

		// If the second argument is a number, the third argument is the 
		// context. We automatically have to add count and n to the 
		// interpolation arguments in that case.
		let ipol;
		if (typeof count === 'number') {
			ipol = {
				count,
				n: count,
				...args,
			};
		} else {
			ipol = count;
		}

		// If the message is an array, we're dealing with pluralizatoin.
		if (Array.isArray(message)) {
			message = pickPlural(message, count);
		}

		// At last evaluate the *compiled* message to get a string as end result.
		return evaluate(message, ipol || {});

	}

	// Now create the actual context and we're done.
	return {
		i18n,
		root: i18n,
		t,
		$t: t,
		$tc: t,
		messages,
		[$lookup]: lookup,
	};

}

// # evaluate(message, ctx)
// Evaluates the given *compiled* message to return a simple textual message. 
// Exported for unit testing, but should not be part of the public api.
export function evaluate(message, ctx) {

	// Strings are returned as is.
	if (typeof message === 'string') return message;

	// Otherwise the message is a function of the type i => i`message ${'key'}`, 
	// which means a tagged template wrapped in a function.
	return message((parts, ...rest) => {
		let out = [parts[0]];
		for (let i = 0; i < rest.length; i++) {
			out.push(ctx[rest[i]], parts[i+1]);
		}
		return out.join('');
	});

}

// # searchMessage(i18n, messages, locale, key)
// Searches for a message, starting with the given locale, but falling back to 
// the fallback locale if possible.
function searchMessage(i18n, messages, locale, key) {

	// First we'll try to lookup the message in the given locale - potentially 
	// stripping the country code from it in the process.
	let message = lookupMessage(i18n, messages, locale, key);
	if (message !== undefined) return message;

	// If the message wasn't found at this point, we'll check for a fallback 
	// locale.
	const { fallbackLocale: fb } = i18n;
	if (fb && fb !== locale) {
		if (!i18n.config.silentFallbackWarn) {
			console.warn(`Using fallback locale "${fb}" for key "${key}"!`);
		}
		let message = lookupMessage(i18n, messages, fb, key);
		if (message !== undefined) return message;
	}

	// If the fallback locale didn't work either, we have no choice but to 
	// return the key as is.
	if (!i18n.config.silentTranslationWarn) {
		console.warn(`No message "${key}" found for locale "${locale}"!`);
	}
	return key;

}

// # lookupMessage(i18n, messages, locale, key)
// Looks up a message for a given *fixed* locale. We first check the *local* 
// messages. If nothing is found, we check the *global* messages on the i18n 
// instance.
function lookupMessage(i18n, messages, locale, key) {

	// First we'll check the full locale, and if the message wasn't found we 
	// check the locale without country code as well. That allows us to override 
	// certain messages for en-US for example.
	let message = get(messages[locale], key);
	if (message !== undefined) return message;

	// If the message was not directly found, check if the locale has a country 
	// code so that we can narrow it if we want.
	if (locale.length > 2) {
		let lang = locale.slice(0, 2);
		let message = get(messages[lang], key);
		if (message !== undefined) return message;
	}

	// If we reach this point, we'll check the global messages in a similar 
	// fashion.
	message = get(i18n.messages[locale], key);
	if (message !== undefined) return message;

	// At last we'll split again if it might contain a country code.
	let lang = locale.slice(0, 2);
	return get(i18n.messages[lang], key);

}

// # get(object, key)
function get(object, key) {
	if (!object) return;
	return object[key];
}
