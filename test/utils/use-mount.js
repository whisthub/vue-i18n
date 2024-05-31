// # use-mount.js
import { mount } from '@vue/test-utils';

export function useMount() {
	return function() {
		this.mount = function(Component, options) {
			
			let view = mount(Component, options);
			let { vm } = view;
			return {
				view,
				vm,
				$(selector) {
					return vm.$el.querySelector(selector);
				},
				$$(selector) {
					return vm.$el.querySelectorAll(selector);
				},
			};
		};
	};
}
