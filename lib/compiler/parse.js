// # compiler/parse.js

// # parse(message)
// The parse function transforms the message into an ast, which is then passed 
// to the compiler, or can be interpreted by the jit.
export default function parse(message) {

	// Split the message based on the | separator for pluralization and then 
	// parse the ast for everyone of them.
	let parts = split(message);
	let ast = parts.map(message => parseSingle(message));
	return ast.length === 1 ? ast[0] : ast;

}

// # parseSingle(message)
// Parses the ast for a single message.
const regex = /{\s*?([a-zA-Z0-9_.]+)\s*?}/;
function parseSingle(message) {
	let str = message;
	let tokens = [];
	while (str.length > 0) {
		let match = regex.exec(str);
		if (match === null) {
			tokens.push({
				type: 'text',
				text: str,
			});
			break;
		}

		// If there was a match, add the tokens.
		let text = str.slice(0, match.index);
		if (text.length > 0) {
			tokens.push({
				type: 'text',
				text,
			});
		}
		tokens.push({
			type: 'interpolation',
			key: match[1].trim(),
		});
		str = str.slice(match.index + match[0].length);

	}
	return {
		type: 'message',
		tokens,
	};
}

// # split(message)
// Splits a message based on the | separator. We have to take into account that 
// it can be escaped though.
function split(message) {
	let parts = [];
	let str = message;
	let index = -1;
	while ((index = str.indexOf('|', index+1)) > -1) {
		if (str.charAt(index-1) === '\\') continue;
		parts.push(str.slice(0, index).trim());
		str = str.slice(index+1);
	}
	parts.push(str.trim());
	return parts;
}
