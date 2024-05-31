// # i18n-component.js
import { h, inject, getCurrentInstance, Fragment } from 'vue';
import { $local, $global, $lookup, $i18n } from './symbols.js';

export default {
	name: 'i18n-t',
	props: {
		keypath: {
			type: String,
			required: true,
		},
		tag: {
			type: [String, Object],
		},
		scope: {
			type: String,
			validator: val => val === 'parent' || val === 'global',
			default: 'parent',
		},
		i18n: {
			type: Object,
		},
	},
	setup(props, context) {
		const { slots, attrs } = context;
		const instance = getCurrentInstance();
		const { scope } = props;
		const i18n = inject($i18n);
		const ctx = scope === 'parent' ? getParentContext(instance) : i18n[$global];
		return () => {
			const tag = props.tag || Fragment;
			const message = ctx[$lookup](props.keypath);
			let children = [];
			if (typeof message === 'string') {
				children = [message];
			} else if (typeof message === 'function') {
				children = [];
				message((parts, ...keys) => {
					if (parts[0]) children.push(parts[0]);
					for (let i = 0; i < keys.length; i++) {
						let slot = slots[keys[i]] || slots.default;
						children.push(
							slot(),
							parts[i+1],
						);
					}
				});
			}
			return h(tag, { ...attrs }, children);
		};
	},
};

// # getParentContext(instance)
// This function looks up a parent component that has a *local* i18n context.
function getParentContext(instance) {
	let current = instance.parent;
	while (current) {
		let ctx = current[$local];
		if (ctx) return ctx;
	}
	return null;
}
