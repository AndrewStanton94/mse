const { JSDOM } = require('jsdom');

// Rate has conditions
// Interest paid annually
// Deposits written in full
// Multiple unsuitable "How to open" values
const rawHTML1 = `<tr >
	<td><a href="https://www.furnessbs.co.uk/savings/savings-interest-rates/product-overview/triple-access-saver-issue-1" target="_blank"><strong>Furness BS</strong></a></td>
	<td><p><strong>5%</strong></p> <p><em>(max three withdrawals a year)</em></p> </td>
	<td>Annually</td>
	<td>£1/ £250,000</td>
	<td>Phone/ post/ branch</td>
</tr>`;
const rawHTML1PostProcessing = `<tr
	data-rate="5"
	<p><em>(max three withdrawals a year)</em></p>
	data-interest-payment-frequency="[annually]"
	data-min-deposit="1"
	data-max-deposit="250_000"
	data-how-to-open="[phone, post, branch]"
>
</tr>`;

// Rate has no conditions
// Multiple interest rate payment frequencies
// Postfix used on deposit limit
// Single "How to open" value
const rawHTML2 = `<tr >
	<td><strong><a  href="https://www.cahoot.com/products-and-services/cahoot-simple-saver" target="_blank">Cahoot</a></strong></td>
	<td><strong>4.9%</strong></td>
	<td>Monthly or annually</td>
	<td>£1/ £2m</td>
	<td>Online</td>
</tr>`;
const rawHTML2PostProcessing = `<tr
	data-rate="4.9"
	data-interest-payment-frequency="[monthly, annually]"
	data-min-deposit="1"
	data-max-deposit="2_000_000"
	data-how-to-open="[online]"
>
</tr>`;
const dom2 = new JSDOM(rawHTML2PostProcessing);
console.log(dom2.window.document);
console.log(dom2.window.document.querySelector('tr'));

test('JSDOM works', () => {
	const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
	const { textContent } = dom.window.document.querySelector('p');
	expect(textContent).toBe('Hello world');
});

describe('Interest rate', () => {
	test.todo('Should extract the interest rate');
	test.todo('Should extract the interest rate as a decimal');
	test.todo('Should extract qualifying text into a separate field');
});

describe('Notice period', () => {
	test.todo('Should extract the notice period when it exists');
	test.todo('Should support accounts without notice periods');
});

describe('Interest payment frequency', () => {
	test.todo('Should extract how often I would receive interest payment');
	test.todo('Should support multiple payment frequencies');
});

describe('Deposit limits', () => {
	test.todo('Should extract the Minimum deposit');
	test.todo('Should support numbers with comas in them');
	test.todo('Should support numbers with the m abbreviation in them');
});

describe('How to open', () => {
	test.todo('Should extract the "How to open" options as an array');
	test.todo('Should lowercase each way to open');
	test.todo('Should flag "no joint" accounts');
});
