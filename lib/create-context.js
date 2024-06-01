// # create-context.js
import { toValue } from 'vue';
import { $lookup } from './symbols.js';
import searchMessage from './search-message.js';
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
		return evaluate(message, ipol);

	}

	// Now create the actual context and we're done.
	return {
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
