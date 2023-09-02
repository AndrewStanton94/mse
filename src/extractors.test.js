const { JSDOM } = require('jsdom');
const extractors = require('./extractors');

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
const inputDOM1 = new JSDOM(`<table>${rawHTML1}</table>`);
const expectedHTML1 = `<tr
	data-rate="5"
	data-rate-qualifier="(max three withdrawals a year)"
	data-interest-payment-frequency="[&quot;annually&quot;]"
	data-min-deposit="1"
	data-max-deposit="250_000"
	data-how-to-open="[&quot;phone&quot;,&quot;post&quot;,&quot;branch&quot;]"
>
</tr>`;
const expectedDOM1 = JSDOM.fragment(`${expectedHTML1}`);

// Rate has no conditions
// Multiple interest rate payment frequencies
// Postfix used on deposit limit
// Single "How to open" value
const rawHTML2 = `<tr >
	<td><strong><a href="https://www.cahoot.com/products-and-services/cahoot-simple-saver" target="_blank">Cahoot</a></strong></td>
	<td><strong>4.9%</strong></td>
	<td>Monthly or annually</td>
	<td>£1/ £2m</td>
	<td>Online</td>
</tr>`;
const inputDOM2 = new JSDOM(`<table>${rawHTML2}</table>`);
const expectedHTML2 = `<tr
	data-rate="4.9"
	data-interest-payment-frequency="[&quot;monthly&quot;,&quot;annually&quot;]"
	data-min-deposit="1"
	data-max-deposit="2_000_000"
	data-how-to-open="[&quot;online&quot;]"
>
</tr>`;
const expectedDOM2 = JSDOM.fragment(`${expectedHTML2}`);

test('JSDOM works', () => {
	const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
	const { textContent } = dom.window.document.querySelector('p');
	expect(textContent).toBe('Hello world');
});

describe('Interest rate', () => {
	test('Should set the interest rate', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.rate(relevantRow);
		expect(actual?.dataset?.rate).toBeDefined();
	});

	test('Should extract the decimal interest rate', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.rate(relevantRow);
		const {
			dataset: { rate },
		} = expectedDOM2.firstChild;
		expect(actual.dataset.rate).toBe(rate);
	});

	test('Should extract the integer interest rate', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.rate(relevantRow);
		const {
			dataset: { rate },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.rate).toBe(rate);
	});

	test('Should extract qualifying text into a separate field', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.rate(relevantRow);
		const {
			dataset: { rateQualifier },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.rateQualifier).toBe(rateQualifier);
	});
});

describe('Notice period', () => {
	test.todo('Should extract the notice period when it exists');
	test.todo('Should support accounts without notice periods');
});

describe('Interest payment frequency', () => {
	test('Should extract how often I would receive interest payment', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.paymentFrequency(relevantRow);
		expect(actual?.dataset?.interestPaymentFrequency).toBeDefined();
	});

	test('Should support a single payment frequency', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.paymentFrequency(relevantRow);
		const {
			dataset: { interestPaymentFrequency },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.interestPaymentFrequency).toBe(
			interestPaymentFrequency,
		);
	});

	test('Should support multiple payment frequencies', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.paymentFrequency(relevantRow);
		const {
			dataset: { interestPaymentFrequency },
		} = expectedDOM2.firstChild;
		expect(actual.dataset.interestPaymentFrequency).toBe(
			interestPaymentFrequency,
		);
	});

	test('Should save payment frequencies in lowercase', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.paymentFrequency(relevantRow);
		expect(actual.dataset.interestPaymentFrequency).toMatch(/[a-z[\] ]/);
	});
});

describe('Deposit limits', () => {
	test('Should extract the Minimum deposit', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.deposits(relevantRow);
		expect(actual?.dataset?.minDeposit).toBeDefined();

		const {
			dataset: { minDeposit },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.minDeposit).toBe(minDeposit);
	});

	test('Should extract the Maximum deposit', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.deposits(relevantRow);
		expect(actual?.dataset?.maxDeposit).toBeDefined();
	});

	test('Should support numbers with comas in them', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.deposits(relevantRow);
		const {
			dataset: { maxDeposit },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.maxDeposit).toBe(maxDeposit);
	});

	test('Should support numbers with the m abbreviation in them', () => {
		const relevantRow = inputDOM2.window.document.querySelector('tr');
		const actual = extractors.deposits(relevantRow);
		const {
			dataset: { maxDeposit },
		} = expectedDOM2.firstChild;
		expect(actual.dataset.maxDeposit).toBe(maxDeposit);
	});
});

describe.skip('How to open', () => {
	test('Should extract the "How to open" options as an array', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.howToOpen(relevantRow);
		const {
			dataset: { howToOpen },
		} = expectedDOM1.firstChild;
		expect(actual.dataset.howToOpen).toBe(howToOpen);
	});
	test('Should lowercase each "How to open" option', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.howToOpen(relevantRow);
		expect(actual.dataset.howToOpen).toMatch(/[a-z[\] ]/);
	});
	test.skip('Should flag "no joint" accounts', () => {});
});
