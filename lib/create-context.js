// # create-context.js
import { toValue } from 'vue';
import { $lookup } from './symbols.js';
import createTranslation from './create-translation.js';
import searchMessage from './search-message.js';

// # createContext(i18n, opts)
// Creates a i18n context with a translation function based on the resolved 
// options. The context can either be local - in which case we need the local 
// messages to be injected - 
export default function createContext(i18n, opts = {}) {
	const { messages = {} } = opts;
	const t = createTranslation(i18n, opts);
	return {
		t,
		$t: t,
		$tc: t,
		messages,
		[$lookup](key) {
			const locale = toValue(opts.locale) || toValue(i18n.locale);
			return searchMessage(i18n, messages, locale, key);
		},
	};
}
