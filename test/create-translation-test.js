// # create-translation-test.js
import { expect } from 'chai';
import { createI18n } from '@whisthub/vue-i18n';
import createTranslation from '#lib/create-translation.js';

describe('The translation factory', function() {

	before(function() {
		this.setup = function(opts) {
			return createI18n({
				silentTranslationWarn: true,
				silentFallbackWarn: true,
				...opts,
			});
		};
	});

	it('translates global messages', function() {

		const i18n = this.setup({
			locale: 'en',
			messages: {
				en: {
					greeting: 'Hello world!',
				},
				nl: {
					greeting: 'Hallo wereld!',
				},
			},
		});
		const t = createTranslation(i18n);
		expect(t('greeting')).to.equal('Hello world!');

		i18n.locale = 'nl';
		expect(t('greeting')).to.equal('Hallo wereld!');

	});

	it('interpolates global messages', function() {

		const i18n = this.setup({
			locale: 'nl',
			messages: {
				nl: {
					greeting: i => i`Hello ${'name'}!`,
				},
			},
		});

		const t = createTranslation(i18n);
		expect(t('greeting', { name: 'Whisthub' })).to.equal('Hello Whisthub!');

	});

	it('interpolates local messages', function() {

		const i18n = this.setup({ locale: 'en' });

		const t = createTranslation(i18n, {
			messages: {
				en: {
					greeting: 'Hello',
				},
				fr: {
					greeting: 'Bonjour',
				},
			},
		});
		expect(t('greeting')).to.equal('Hello');
		i18n.locale = 'fr';
		expect(t('greeting')).to.equal('Bonjour');

	});

	it('supports pluralization & interpolation', function() {

		const i18n = this.setup({ locale: 'en' });

		const t = createTranslation(i18n, {
			messages: {
				en: {
					banana: [
						'One banana',
						i => i`${'n'} bananas`,
					],
				},
				nl: {
					banana: [
						i => i`Geen bananen in ${'where'}`,
						'Eén banaan',
						i => i`${'count'} bananen`,
					],
				},
			},
		});

		expect(t('banana', 1)).to.equal('One banana');
		expect(t('banana', 5)).to.equal('5 bananas');
		expect(t('banana', 5, { n: 'Too many' })).to.equal('Too many bananas');

		i18n.locale = 'nl';
		expect(t('banana', 0, { where: 'mijn mond' })).to.equal('Geen bananen in mijn mond');
		expect(t('banana', 1)).to.equal('Eén banaan');
		expect(t('banana', 10)).to.equal('10 bananen');
		expect(t('banana', 100, { count: 'Te veel' })).to.equal('Te veel bananen');

	});

	it('prefers the country code', function() {

		const i18n = this.setup({
			locale: 'en-US',
			messages: {
				en: {
					greeting: 'Hello everyone!',
					question: 'How are you?',
				},
				'en-US': {
					greeting: 'Hello America!',
				},
			},
		});

		const t = createTranslation(i18n);
		expect(t('greeting')).to.equal('Hello America!');
		expect(t('question')).to.equal('How are you?');

		i18n.locale = 'en-CA';
		expect(t('greeting')).to.equal('Hello everyone!');
		expect(t('question')).to.equal('How are you?');

	});

	it('falls back to the fallbackLocale if possible', function() {

		const i18n = this.setup({
			locale: 'es',
			fallbackLocale: 'en',
		});

		const t = createTranslation(i18n, {
			messages: {
				en: {
					greeting: 'Hello',
				},
			},
		});
		expect(t('greeting')).to.equal('Hello');

	});

});
