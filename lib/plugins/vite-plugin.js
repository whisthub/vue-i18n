// # vite-plugin.js
import { createFilter } from '@rollup/pluginutils';
import compile from '../compiler/compile.js';

export default function i18nPlugin(opts = {}) {
	const {
		include = [/\.i18n\.json$/, /\.i18n\.ya?ml$/],
		exclude,
	} = opts;
	const filter = createFilter(include, exclude);
	return {
		name: '@whisthub/vue-i18n-precompile',
		transform(source, id) {
			if (!filter(id)) return false;
			let messages = JSON.parse(source);
			let json = compile(messages);
			return `export default ${json};`;
		},
	};
}
