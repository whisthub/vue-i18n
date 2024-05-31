// # jit.js
import parse from './parse.js';

// # jit(message)
// Performs a just-in-time compilation for the message.
export default function jit(message) {
	const ast = parse(message);
	if (Array.isArray(ast)) {
		return ast.map(ast => wrap(ast));
	} else {
		return wrap(ast);
	}
}

// # wrap(ast)
function wrap(ast) {

	// If we only have a single text token, there is nothing to be interpreted, 
	// just return the string.
	let { tokens } = ast;
	if (tokens.length === 1 && tokens[0].type === 'text') {
		return tokens[0].text;
	}

	// Otherwise we have to return a function that is functionally equivalent to 
	// the compiled i => i`Hello {name}!` function.
	let parts = [];
	let keys = [];
	if (tokens[0].type !== 'text') parts.push('');
	for (let token of tokens) {
		if (token.type === 'text') {
			parts.push(token.text);
		} else if (token.type === 'interpolation') {
			keys.push(token.key);
		}
	}
	return function(i) {
		return i(parts, ...keys);
	};

}
