// # compile.js
import { parse, NodeTypes } from './parse.js';

// # compile(message)
// The entry point for compiling messages. Supports both compiling a single 
// message string, or an object containing messages.
export default function compile(message) {

	// If we're dealing with a simple message as input, compile it right away.
	if (typeof message === 'string') {
		return compileMessage(message);
	}

	// We now assume we're dealing with an object. We're not going to make it 
	// too complex on ourselves: just stringify as a json object, and then 
	// replace.
	return compileObject(message);

}

// # compileMessage()
function compileMessage(message) {

	// If we're dealing with a plural message, then compile every single one.
	const ast = parse(message);
	const { body } = ast;
	if (body.type === NodeTypes.Plural) {
		let array = body.cases.map(ast => compileSingle(ast));
		return `[${array}]`;
	} else if (body.type === NodeTypes.Message) {
		return compileSingle(body);
	}

}

// # compileSingle(ast)
// Compiles a single message.
function compileSingle(ast) {

	// If there are no interpolations, we just compile it to a string, otherwise 
	// we compile it to a tagged literal.
	const { items } = ast;
	if (items.length === 1) {
		const [item] = items;
		switch (item.type) {
			case NodeTypes.Text: return JSON.stringify(item.value);
			case NodeTypes.Literal: return JSON.stringify(item.value);
		}
	}

	// At this point we know that there are no shortcuts, so compile one by one.
	let body = '';
	for (let token of items) {
		const { type } = token;
		if (type === NodeTypes.Text || type === NodeTypes.Literal) {
			body += escape(token.value);
		} else if (type === NodeTypes.Named) {
			body += `\${${JSON.stringify(token.key)}}`;
		} else if (type === NodeTypes.List) {
			body += `\${${JSON.stringify(token.index)}}`;
		} else {
			console.warn(
				'Linked, LinkedKey and LinkedModifiers are not supported!',
			);
		}
	}
	return `i => i\`${body}\``;

}

// # compileObject(object)
// Compiles an object to JavaScript code. Unfortunately we can't use 
// JSON.stringify with a replacer because it will stringify our functions. Hence 
// we need to implement this ourselves with recursion.
function compileObject(object) {
	let entries = [];
	for (let [key, value] of Object.entries(object)) {
		if (typeof value === 'object' && !Array.isArray(value)) {
			entries.push(`${JSON.stringify(key)}:${compileObject(value)}`);
		} else if (typeof value === 'string') {
			let fn = compileMessage(value);
			entries.push(`${JSON.stringify(key)}:${fn}`);
		} else {
			entries.push(`${JSON.stringify(key)}:${JSON.stringify(value)}`);
		}
	}
	return `{${entries}}`;
}

// # escape(str)
function escape(str) {
	return str.replace(/`/g, '\\`');
}
