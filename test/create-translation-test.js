// # create-translation-test.js
import { expect } from 'chai';
import { createI18n } from '@whisthub/vue-i18n';
import createTranslation from '#lib/create-translation.js';

describe('The translation factory', function() {

	it('translates global messages', function() {

		const i18n = createI18n({
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

		const i18n = createI18n({
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

	it('prefers the country code', function() {

		const i18n = createI18n({
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

});
