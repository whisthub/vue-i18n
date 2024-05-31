// # create-translation.js
import { toValue } from 'vue';
import searchMessage from './search-message.js';
import pickPlural from './pick-plural.js';

// # createTranslation(i18n, opts)
export default function createTranslation(i18n, opts = {}) {
	const { messages = {} } = opts;
	return function translate(key, number, ctx) {

		// Lookup the message based on the key and current locale.
		const locale = toValue(opts.locale) || toValue(i18n.locale);
		let message = searchMessage(i18n, messages, locale, key);

		// If the second argument is a number, the third argument is the 
		// context. We automatically have to add count and n to the context in 
		// that case.
		let context;
		if (typeof number === 'number') {
			context = {
				n: number,
				count: number,
				...ctx,
			};
		} else {
			context = number;
		}

		// If the message is an array, we're dealing with pluralization.
		if (Array.isArray(message)) {
			message = pickPlural(message, number);
		}

		// At last evaluate the message in the given context.
		return evaluate(message, context);

	};
}

// # evaluate(message, ctx)
// Evaluates the given *compiled* message to return a simple textual message.
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
