// # vite-plugin.js
import { createFilter } from '@rollup/pluginutils';
import compile from '../compiler/compile.js';

export default function i18nPlugin(opts = {}) {
	const {
		include = [/\.i18n\.json$/],
		exclude,
	} = opts;
	const filter = createFilter(include, exclude);
	return {
		name: '@whisthub/vue-i18n-precompile',
		transform(source, id) {
			if (!filter(id) && !id.includes('vue&type=i18n')) return false;

			// If a parent module transforms json to
			// `export default {};` it won't properly parse, so try to detect 
			// this and be graceful with it.
			let code = String(source).trim();
			let prefix = 'export default';
			if (code.startsWith(prefix)) {
				code = code.slice(prefix.length);
				if (code.endsWith(';')) code = code.slice(0, -1);
			}

			// Parse as is. Note that even if parsing fails, the object might 
			// still be valid JavaScript - for example already precompiled 
			// messages, so swallow this gracefull as well.
			let messages;
			try {
				messages = JSON.parse(code);
			} catch {
				return source;
			}

			// Cool, parsing of the messages was succesful, now compile to valid 
			// JavaScript.
			let json = compile(messages);

			// Normally we now just have to `export default` the compiled 
			// messages, but if we're running in the context if a custom <i18n> 
			// block in a Vue SFC, we have to wrap it onto the component.
			if (id.includes('vue&type=i18n')) {
				return `
				const messages = ${json};
				export default function(Component) {
					Component.i18n = { messages };
				};`;
			}

			// Default is just exporting.
			return `export default ${json};`;

		},
	};
}
