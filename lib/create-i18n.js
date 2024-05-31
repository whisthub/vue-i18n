// # create-i18n.js
import { ref } from 'vue';
import $symbol from './symbol.js';
import I18nComponent from './i18n-component.js';

// # createI18n(opts)
export function createI18n(opts = {}) {

	// Locale and fallback locales should be reactive, so use a ref.
	const locale = ref(opts.locale);
	const fallbackLocale = ref(opts.fallbackLocale);
	const {
		messages = {},
		silentTranslationWarn = false,
		silentFallbackWarn = false,
	} = opts;

	// Return the actual i18n object.
	return {
		get locale() {
			return locale.value;
		},
		set locale(value) {
			locale.value = value;
		},
		get fallbackLocale() {
			return fallbackLocale.value;
		},
		set fallbackLocale(value) {
			fallbackLocale.value = value;
		},
		config: {
			silentTranslationWarn,
			silentFallbackWarn,
		},
		messages,

		// ## install(app)
		// Installs this i18n instance on the Vue application.
		install(app) {
			app.provide($symbol, this);
			app.component('i18n-t', I18nComponent);
		},

	};

}
