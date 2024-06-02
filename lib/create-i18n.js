// # create-i18n.js
import { ref } from 'vue';
import { useI18n } from './use-i18n.js';
import { $i18n, $global } from './symbols.js';
import I18nComponent from './i18n-component.js';
import createContext from './create-context.js';

// # createI18n(opts)
export function createI18n(opts = {}) {

	// Locale and fallback locales should be reactive, so use a ref.
	const locale = ref(opts.locale);
	const fallbackLocale = ref(opts.fallbackLocale);
	const {
		messages = {},
		missingWarn = true,
		fallbackWarn = true,
	} = opts;

	// Return the actual i18n object.
	const i18n = {
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
			missingWarn,
			fallbackWarn,
		},
		messages,

		// ## install(app)
		// Installs this i18n instance on the Vue application.
		install(app) {
			const i18n = this;
			app.provide($i18n, this);

			// Use a mixin so it works with the options api. Note that we don't 
			// provide `$t` and `$tc` on the globalProperties because they need 
			// to be *bound* to the component!
			app.mixin({
				beforeCreate() {
					const options = this.$options;
					if (options.i18n) {
						this.$i18n = useI18n(options.i18n);
					} else {
						this.$i18n = i18n[$global];
					}
					this.$t = (...args) => this.$i18n.t(...args);
					this.$tc = (...args) => this.$i18n.t(...args);
				},
			});

			// Register the <i18n-t> component.
			app.component('i18n-t', I18nComponent);

		},

	};
	i18n[$global] = createContext(i18n, { messages });
	return i18n;

}
