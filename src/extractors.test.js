const { JSDOM } = require('jsdom');

test('JSDOM works', () => {
	const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
	const { textContent } = dom.window.document.querySelector('p');
	expect(textContent).toBe('Hello world');
});

describe('Interest payment rate', () => {
	test.todo('Should extract the interest rate');
	test.todo('Should extract qualifying text into a separate field');
});

describe('Notice period', () => {
	test.todo('Should extract the notice period when it exists');
	test.todo('Should support accounts without notice periods');
});
describe('Deposit limits', () => {
	test.todo('Should extract the Minimum deposit');
});

describe('How to open', () => {
	test.todo('Should extract the ways to open as an array');
	test.todo('Should lowercase each way to open');
});
