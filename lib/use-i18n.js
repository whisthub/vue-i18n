// # use-i18n.js
import { inject, getCurrentInstance } from 'vue';
import { $i18n, $global, $local } from './symbols.js';
import createContext from './create-context.js';

// # useI18n(opts)
// The composable that has to be called inside the `setup()` function to make 
// use of the translation functionalities. It will look up and return the 
// appropriate context - potentially the global or parent context - or create a 
// new one if it does not exist.
export function useI18n(opts = {}) {

	// Access to the i18n object can be done with provide/inject, but if you're 
	// using it outside components or with SSR for example, then you might need 
	// to inject the i18n automatically to provide cross-request state pollution.
	// See https://pinia.vuejs.org/core-concepts/outside-component-usage.html 
	// for the same problem with Pinia for more info for example.
	const {
		i18n = inject($i18n),
		scope = 'locale',
		messages,
	} = opts;

	// If we're requesting the *global* context, then access it on the i18n 
	// object.
	if (scope === 'global') return i18n[$global];

	// If we're requesting the *parent* context - which happens for example in 
	// the <i18n-t> component - then we have to look it up. Again, you might 
	// need to pass the component instance explicitly, but it's not needed 
	// inside setup()
	if (scope === 'parent') {
		const { instance = getCurrentInstance() } = opts;
		return getParentContext(instance) || i18n[$global];
	}

	// By default we're creating a *local* context. Note that we can only have 
	// one context per instance, so check if one has already been registered, 
	// and if so just return it.
	const {
		locale,
		instance = getCurrentInstance(),
	} = opts;
	if (instance && instance[$local]) return instance[$local];

	// Cool, no cached context found, that means that we create a fresh new one.
	const context = createContext(i18n, {
		messages,
		locale,
	});

	// Context has been created, now assign it to this component instance o that 
	// the <i18n-t> component can find it in the parent chain.
	if (instance) {
		instance[$local] = context;
	}
	return context;

}

// # getParentContext(instance)
// This function looks up a parent component that has a *local* i18n context.
function getParentContext(instance) {
	let current = instance.parent;
	while (current) {
		let ctx = current[$local];
		if (ctx) return ctx;
	}
	return null;
}
