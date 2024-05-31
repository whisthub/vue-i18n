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

		// If the message is an array, we're dealing with pluralization.
		let context = ctx;
		if (Array.isArray(message)) {
			message = pickPlural(message, number);
			context = {
				n: number,
				count: number,
				...context,
			};
		} else {

			// If we're not dealing with pluralization, then the *second* 
			// argument is actually the context.
			context = number;

		}

		// If the message is a simple string, return as is. Note that we assume 
		// that all messages are already precompiled here. If that's not the 
		// case, you have to manually compile them first!
		if (typeof message === 'string') return message;

		// If the message is a function, it should be a tagged literal, which 
		// should be evaluated.
		return message(evaluate.bind(null, context));

	};
}

// # evaluate(ctx)
// Evaluates a message as a function where we expect the template to be a *tagged
function evaluate(ctx, parts, ...rest) {
	let out = [parts[0]];
	for (let i = 0; i < rest.length; i++) {
		out.push(ctx[rest[i]], parts[i+1]);
	}
	return out.join('');
}
