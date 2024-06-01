// # compile.js
import { parse, NodeTypes } from './parse.js';

// # compile(message)
export default function compile(message) {

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

// # escape(str)
function escape(str) {
	return str.replace(/`/g, '\\`');
}
