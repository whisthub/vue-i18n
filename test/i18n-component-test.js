// # i18n-component-test.js
import { nextTick } from 'vue';
import { expect } from 'chai';
import { useMount } from './utils/use-mount.js';
import { createI18n } from '@whisthub/vue-i18n';
import TestComponent from './components/i18n-test.vue';

describe('The <i18n-t> component', function() {

	before(useMount());

	before(function() {
		this.setup = function() {
			const i18n = createI18n({
				locale: 'nl',
				fallbackLocale: 'en',
				missingWarn: false,
				fallbackWarn: false,
			});
			return this.mount(TestComponent, {
				global: {
					plugins: [i18n],
				},
			});
		};
	});

	it('renders correctly', function() {

		let { $ } = this.setup();
		expect($('p.fragment').innerHTML).to.equal('Hello <span>Whisthub</span>!');
		expect($('p.tag').innerHTML).to.equal('Hello <b>stranger</b>!');
		expect($('p.named').innerHTML).to.equal('Hallo Whisthub!');
		expect($('.slot').textContent).to.equal('Hello stranger!');

	});

	it('pluralization', async function() {

		let { $, vm } = this.setup();
		expect($('p.plural').textContent).to.equal('Geen bananen');

		vm.increment();
		await nextTick();
		expect($('p.plural').textContent).to.equal('Eén banaan');

		vm.increment();
		await nextTick();
		expect($('p.plural').textContent).to.equal('2 bananen');

		vm.increment();
		vm.increment();
		await nextTick();
		expect($('p.plural').textContent).to.equal('4 bananen');

	});

});
