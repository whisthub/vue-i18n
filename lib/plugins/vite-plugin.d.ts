import type { CreateFilter } from '@rollup/pluginutils';

type VitePluginOptions = {
	include?: Parameters<CreateFilter>[0];
	exclude?: Parameters<CreateFilter>[1];
};

export default function i18nPlugin(opts?: VitePluginOptions): {
	name: '@whisthub/vue-i18n-precompile';
	transform: (source: any, id: string) => string;
}
