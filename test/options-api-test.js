// # options-api-test.js
import { expect } from 'chai';
import { createI18n } from '@whisthub/vue-i18n';
import { useMount } from './utils/use-mount.js';
import OptionsComponent from './components/options-api.vue';

describe('The options api', function() {

	before(useMount());

	before(function() {
		this.setup = function() {
			const i18n = createI18n({
				locale: 'en',
				fallbackLocale: 'en',
			});
			return this.mount(OptionsComponent, {
				global: {
					plugins: [i18n],
				},
			});
		};
	});

	it('renders correctly', function() {

		let { $ } = this.setup();
		expect($('p.welcome').textContent).to.equal('Welcome!');
		expect($('p.greeting').textContent).to.equal('Hello Whisthub!');
		expect($('p.bananas').textContent).to.equal('10 bananas');
		expect($('p.no-bananas').textContent).to.equal('No bananas');

	});

	it('binds $t and $tc to the component', function() {

		let { vm } = this.setup();
		expect(vm.translate('welcome')).to.equal('Welcome!');

	});

});
