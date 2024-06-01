// # compiler-test.js
import { expect } from 'chai';
import vm from 'node:vm';
import compile from '#lib/compiler/compile.js';
import jit from '#lib/compiler/jit.js';
import { evaluate } from '#lib/create-context.js';

describe('The compiler', function() {

	before(function() {
		this.t = function(message, ...args) {
			let value = this.compile(message);
			return evaluate(value, ...args);
		};
	});

	function run() {

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
			let value = this.compile(message);
			expect(value).to.be.an('array');
			expect(value).to.have.length(2);
			expect(value[0]).to.be.a('string');
			expect(value[1]).to.be.a('function');

			expect(evaluate(value[1], { n: 13 })).to.equal('13 cards');

		});

		it('an object with messages', function() {

			let messages = {
				en: {
					greeting: 'Hello {name}!',
				},
				fr: {
					text: 'Ceci est le contenu du texte',
				},
			};
			let value = this.compile(messages);
			expect(value).to.be.an('object');
			expect(evaluate(value.en.greeting, { name: 'Whisthub' })).to.equal('Hello Whisthub!');
			expect(evaluate(value.fr.text)).to.equal('Ceci est le contenu du texte');

		});

	}

	describe('precompiler', function() {

		before(function() {
			this.compile = function(code) {
				return vm.runInNewContext(`(${compile(code)})`);
			};
		});

		run();

	});

	describe('jit compiler', function() {

		before(function() {
			this.compile = code => jit(code);
		});

		run();

	});

});
