// # compiler/parse.js
import { createParser } from '@intlify/message-compiler';

export const NodeTypes = {
	Resource: 0,
	Plural: 1,
	Message: 2,
	Text: 3,
	Named: 4,
	List: 5,
	Linked: 6,
	LinkedKey: 7,
	LinkedModifier: 8,
	Literal: 9,
};

// # parse(message)
// The parse function transforms the message into an ast, which is then passed 
// to the compiler, or can be interpreted by the jit. Node that we use the same 
// parser as vue-i18n under the hood, so the syntax has not changed!
const parser = createParser();
export function parse(message) {
	return parser.parse(message);
}
