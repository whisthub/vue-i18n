// # use-i18n-test.js
import { expect } from 'chai';
import { createI18n, useI18n } from '@whisthub/vue-i18n';

describe('The useI18n function', function() {

	it('does not create duplicate contexts per instance', function() {

		const i18n = createI18n();
		const instance = {};
		const one = useI18n({ i18n, instance });
		const two = useI18n({ i18n, instance });
		expect(one).to.equal(two);

	});

	it('allows creating isolated contexts, not tied to the component', function() {

		const i18n = createI18n();
		const instance = {};
		const local = useI18n({ i18n, instance });
		const one = useI18n({ scope: 'isolated', i18n, instance });
		const two = useI18n({ scope: 'isolated', i18n, instance });
		expect(one).to.not.equal(two);
		expect(local).to.not.equal(one);
		expect(local).to.not.equal(two);

	});

	it('provides the root i18n instance', function() {

		const root = createI18n();
		const { i18n } = useI18n({ i18n: root });
		expect(i18n).to.equal(root);

	});

});
