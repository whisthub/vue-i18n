// # search-message.js
// # searchMessage(i18n, messages, locale, key)
// Searches for a message, starting with the given locale, but falling back to 
// the fallback locale if possible.
export default function searchMessage(i18n, messages, locale, key) {

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
