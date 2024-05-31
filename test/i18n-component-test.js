// # i18n-component-test.js
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import { createI18n } from '@whisthub/vue-i18n';
import TestComponent from './components/i18n-test.vue';

describe('The <i18n-t> component', function() {

	before(function() {
		this.mount = function() {
			const i18n = createI18n({
				locale: 'nl',
				fallbackLocale: 'en',
				silentFallbackWarn: true,
			});
			let view = mount(TestComponent, {
				global: {
					plugins: [i18n],
				},
				props: {},
			});
			let { vm } = view;
			return {
				view,
				vm,
				i18n,
				$(selector) {
					return vm.$el.querySelector(selector);
				},
				$$(selector) {
					return vm.$el.querySelectorAll(selector);
				},
			};
		};
	});

	it('renders correctly', function() {

		let { $ } = this.mount();
		expect($('p.fragment').innerHTML).to.equal('Hello <span>Whisthub</span>!');
		expect($('p.tag').innerHTML).to.equal('Hello <b>stranger</b>!');
		expect($('p.named').innerHTML).to.equal('Hallo Whisthub!');

	});

	it('pluralization', async function() {

		let { $, vm } = this.mount();
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
