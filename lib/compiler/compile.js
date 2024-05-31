// # compile.js
import parse from './parse.js';

// # compile(message)
export default function compile(message) {
	const ast = parse(message);
	if (Array.isArray(ast)) {
		return `[${ast.map(token => compileSingle(token))}]`;
	} else {
		return compileSingle(ast);
	}
}

// # compileSingle(ast)
// Compiles a single message.
function compileSingle(ast) {

	// If there are no interpolations, we just compile it to a string, otherwise 
	// we compile it to a tagged literal.
	let { tokens } = ast;
	if (tokens.length === 1 && tokens[0].type === 'text') {
		return JSON.stringify(tokens[0].text);
	}

	// Compile the body of the tagged template.
	let body = '';
	for (let token of tokens) {
		if (token.type === 'text') {
			body += token.text;
		} else if (token.type === 'interpolation') {
			body += `\${${JSON.stringify(token.key)}}`;
		}
	}
	return `i => i\`${escape(body)}\``;

}

// # escape(str)
function escape(str) {
	return str.replace(/`/g, '\\`');
}
