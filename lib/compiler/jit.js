// # jit.js
import { parse, NodeTypes } from './parse.js';

// # jit(message)
// Performs just-in-time compilation for a message, or an entire object of 
// messages.
export default function jit(message) {

	// Single message
	if (typeof message === 'string') {
		return jitMessage(message);
	}

	// We now assume we're dealing with an object.
	return jitObject(message);

}

// # jitMessage(message)
// Performs a just-in-time compilation for a single message.
function jitMessage(message) {
	const ast = parse(message);
	const { body } = ast;
	if (body.type === NodeTypes.Plural) {
		return body.cases.map(ast => jitSingle(ast));
	} else if (body.type === NodeTypes.Message) {
		return jitSingle(body);
	}
}

// # jitSingle(ast)
function jitSingle(ast) {

	// If we only have a single text or literal token, there is nothing to be 
	// interpreted, just return the string.
	const { items } = ast;
	if (items.length === 1) {
		const [item] = items;
		switch (item.type) {
			case NodeTypes.Text: return item.value;
			case NodeTypes.Literal: return item.value;
		}
	}

	// Otherwise we have to return a function that is functionally equivalent to 
	// the compiled i => i`Hello {name}!` function.
	let parts = [''];
	let keys = [];
	for (let item of items) {
		if (item.type === NodeTypes.Named || item.type === NodeTypes.List) {
			if (item.type === NodeTypes.Named) {
				keys.push(item.key);
			} else {
				keys.push(item.index);
			}
			parts.push('');
		} else if (item.type === NodeTypes.Text || NodeTypes.Literal) {
			let index = parts.length-1;
			parts[index] = `${parts[index]}${item.value}`;
		} else {
			console.warn('Not supported');
		}
	}
	return i => i(parts, ...keys);

}

// # jitObject(object)
// Compiles an entire object containing messages.
function jitObject(object) {
	let result = {};
	for (let [key, value] of Object.entries(object)) {
		if (typeof value === 'object' && !Array.isArray(value)) {
			result[key] = jitObject(value);
		} else if (typeof value === 'string') {
			result[key] = jitMessage(value);
		} else {
			result[key] = value;
		}
	}
	return result;
}
