import type { I18n } from './create-i18n.d.ts';
import type { Messages } from './shared.d.ts';

export type UseI18nOptions = {
	messages?: Messages;
	scope?: 'local' | 'global' | 'parent' | 'isolated';
	i18n?: I18n;
};

type TranslateFn = (key: string) => string;

export type I18nContext = {
	readonly i18n: I18n;
	readonly root: I18n;
	readonly messages: Messages;
	t: TranslateFn;
	$t: TranslateFn;
	$tc: TranslateFn;
	locale: string;
};

export declare function useI18n(opts?: UseI18nOptions): I18nContext;
