// # create-translation.js
import { toValue } from 'vue';

// # createTranslation(i18n, opts)
export default function createTranslation(i18n, opts = {}) {
	const { messages = {} } = opts;
	return function translate(key, ctx) {

		// Lookup the message based on the key and current locale.
		const locale = toValue(opts.locale || i18n.locale);
		const message = lookupMessage(i18n, messages, locale, key);
		if (message === undefined) {
			console.warn(`No message "${key}" found for locale "${locale}"!`);
			return key;
		}

		// If the message is a simple string, return as is.
		if (typeof message === 'string') return message;

		// If the message is a function, it should be a tagged literal, which 
		// should be evaluated.
		return message(evaluate.bind(null, ctx));

	};
}

// # lookupMessage(i18n, messages, locale, key)
// Looks up a message for the given locale. We first check the *local* messages. 
// If nothing is found, we check the *global* messages on the i18n instance.
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

// # evaluate(ctx)
// Evaluates a message as a function where we expect the template to be a *tagged
function evaluate(ctx, parts, ...rest) {
	let out = [parts[0]];
	for (let i = 0; i < rest.length; i++) {
		out.push(ctx[rest[i]], parts[i+1]);
	}
	return out.join('');
}
