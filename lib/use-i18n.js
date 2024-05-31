// # use-i18n.js
import { inject, getCurrentInstance } from 'vue';
import { $i18n, $local } from './symbols.js';
import createContext from './create-context.js';

// # useI18n(opts)
// The composable that has to be called inside the `setup()` function to make 
// use of the translation functionalities.
export function useI18n(opts = {}) {

	// Create the i18n context either with local or global messages. It's this 
	// object where the `t` function is registered on, as is the function we 
	// need to lookup messages in the <i18n-t> component.
	const i18n = inject($i18n);
	const { scope = 'local', messages, locale } = opts;
	const contextOptions = scope === 'local' ? {
		messages,
		locale,
	} : {};
	const context = createContext(i18n, contextOptions);

	// Context has been created, now assign it to this component instance so 
	// that the <i18n-t> component can find it in the parent chain. Note that 
	// it's possible that `useI18n` is called *outside* a component, in which we 
	// don't have to set anything of course.
	const instance = getCurrentInstance();
	if (instance) {
		instance[$local] = context;
	}
	return context;

}
