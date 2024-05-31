// # i18n-component-test.js
import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import { createI18n } from '@whisthub/vue-i18n';
import TestComponent from './components/i18n-test.vue';

describe('The <i18n-t> component', function() {

	before(function() {
		this.mount = function() {
			const i18n = createI18n({
				locale: 'en',
			});
			let view = mount(TestComponent, {
				global: {
					plugins: [i18n],
				},
				props: {},
			});
			let { vm } = view;
			return { view, vm, i18n };
		};
	});

	it.only('is mounted correctly', function() {

		let { vm } = this.mount();
		console.log(vm.$el.querySelector('.bare').innerHTML);

	});

});
