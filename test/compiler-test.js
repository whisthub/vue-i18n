// # compiler-test.js
import { expect } from 'chai';
import vm from 'node:vm';
import compile from '#lib/compiler/compile.js';
import jit from '#lib/compiler/jit.js';
import { evaluate } from '#lib/create-context.js';

describe('The compile function', function() {

	before(function() {

		this.eval = function(code) {
			return vm.runInNewContext(code);
		};

		this.t = function(message, ...args) {
			let code = compile(message);
			let value = this.eval(code);
			return evaluate(value, ...args);
		};
	});

	it('a single message without interpolation', function() {

		let message = 'This is a message';
		let result = this.t(message);
		expect(result).to.equal(message);

	});

	it('a single literal', function() {

		let result = this.t(`{'{'}`);
		expect(result).to.equal('{');

	});

	it('a single interpolated message', function() {

		let message = 'Hello {name}!';
		let result = this.t(message, { name: 'Whisthub' });
		expect(result).to.equal('Hello Whisthub!');

	});

	it('a list interpolated message', function() {

		let message = 'Hello {0}! Welcome to {1}!';
		let result = this.t(message, ['Whisthub', 'www.whisthub.com']);
		expect(result).to.equal('Hello Whisthub! Welcome to www.whisthub.com!');

	});

	it('a message with backticks', function() {

		let message = 'Hello `{name}`!';
		let result = this.t(message, { name: 'Whisthub' });
		expect(result).to.equal('Hello `Whisthub`!');

	});

	it('a pluralized message', function() {

		let message = 'One card | {n} cards';
		let value = this.eval(compile(message));
		expect(value).to.be.an('array');
		expect(value).to.have.length(2);
		expect(value[0]).to.be.a('string');
		expect(value[1]).to.be.a('function');

		expect(evaluate(value[1], { n: 13 })).to.equal('13 cards');

	});

});

describe.skip('The jit interpreter', function() {

	it('a single message', function() {

		let message = 'This is a message';
		let fn = jit(message);
		expect(evaluate(fn)).to.equal(message);

	});

	it('an interpolated message', function() {

		let message = 'Hello {name}!';
		let fn = jit(message);
		expect(evaluate(fn, { name: 'Whisthub' })).to.equal('Hello Whisthub!');

	});

	it('a pluralized message', function() {

		let message = 'One card | {n} cards';
		let fn = jit(message);
		expect(fn).to.be.an('array');
		expect(fn).to.have.length(2);
		expect(fn[0]).to.be.a('string');
		expect(fn[1]).to.be.a('function');

		expect(evaluate(fn[1], { n: 13 })).to.equal('13 cards');

	});

});
