import type { App } from 'vue';
import type { Messages, Language } from './shared.d.ts';

export type CreateI18nOptions = {
	locale: string;
	fallbackLocale: string | string[] | Record<string, string | string[]>;
	messages?: Record<string, Language>;
	missingWarn?: boolean;
	fallbackWarn?: boolean;
};

export type I18n = {
	locale: string;
	fallbackLocale: string;
	config: {
		missingWarn: boolean;
		fallbackWarn: boolean;
	};
	readonly messages: Messages;
	install: (app: App) => void;
};

export declare function createI18n(opts?: CreateI18nOptions): I18n;
