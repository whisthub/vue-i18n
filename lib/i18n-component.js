// # i18n-component.js
import { h, Fragment } from 'vue';
import { $lookup, $useComponent } from './symbols.js';
import { useI18n } from './use-i18n.js';
import pickPlural from './pick-plural.js';

export default {
	name: 'i18n-t',
	props: {
		keypath: {
			type: String,
			required: true,
		},
		plural: {
			type: [Number, String],
			validator: val => !Number.isNaN(+val),
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
		const ctx = useI18n({
			scope: props.scope,
			[$useComponent]: true,
		});
		return () => {

			// Lookup the *compiled* message from either the local or global 
			// i18n context.
			let message = ctx[$lookup](props.keypath);

			// If it's a pluralized message, find the correct one based on the 
			// plural property.
			if (Array.isArray(message)) {
				const { plural } = props;
				message = pickPlural(message, plural);
			}

			// If it's just a string, we're done. Otherwise use the message 
			// interpolation function and the slots.
			let children = [];
			if (typeof message === 'string') {
				children.push(message);
			} else {
				message((parts, ...keys) => {
					if (parts[0]) children.push(parts[0]);
					for (let i = 0; i < keys.length; i++) {
						let slot = slots[keys[i]] || slots.default || (() => '');
						children.push(
							slot(),
							parts[i+1],
						);
					}
				});
			}

			// Render at last.
			const tag = props.tag || Fragment;
			return h(tag, { ...attrs }, children);

		};
	},
};
