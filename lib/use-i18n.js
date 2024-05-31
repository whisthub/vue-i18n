// # use-i18n.js
import { inject } from 'vue';
import createTranslation from './create-translation.js';
import $symbol from './symbol.js';

// # useI18n(opts)
export function useI18n(opts) {
	const i18n = inject($symbol);
	return {
		t: createTranslation(i18n, opts),
	};
}
