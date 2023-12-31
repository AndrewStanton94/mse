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

const rawHTMLNotice = `<tr>
	<td rowspan="2"><strong><a href="https://www.oxbury.com/savings">Oxbury Bank</a></strong></td>
	<td><strong>5.59%</strong></td>
	<td>180 days</td>
	<td rowspan="2">Monthly</td>
	<td rowspan="2">£1,000/ £500,000</td>
	<td rowspan="2"><p>Online</p> <p><em>(account management via app only, no joint accounts)</em></p> </td>
</tr>`;
const inputDOMNotice = new JSDOM(`<table>${rawHTMLNotice}</table>`);
const expectedHTMLNotice = `<tr
	data-rate="5.59"
	data-interest-payment-frequency="[&quot;monthly&quot;]"
	data-notice="180"
	data-min-deposit="1_000"
	data-max-deposit="500_000"
	data-how-to-open="[&quot;online&quot;]"
	data-how-to-open-notes="[&quot;account management via app only&quot;,&quot;no joint accounts&quot;]"
>
</tr>`;
const expectedDOMNotice = JSDOM.fragment(`${expectedHTMLNotice}`);

const rawHTMLNotice2 = `<tr class="even">
	<td class="table-cell-darker-blue"><span class="table-cell-darker-blue"><strong>5.53%</strong></span></td>
	<td class="table-cell-darker-blue"><span class="table-cell-darker-blue">120 days</span></td>
</tr>`;
const inputDOMNotice2 = new JSDOM(`<table>${rawHTMLNotice2}</table>`);
const expectedHTMLNotice2 = `<tr
	data-rate="5.53"
	data-interest-payment-frequency="[&quot;monthly&quot;]"
	data-notice="120"
	data-min-deposit="1_000"
	data-max-deposit="500_000"
	data-how-to-open="[&quot;online&quot;]"
>
</tr>`;
const expectedDOMNotice2 = JSDOM.fragment(`${expectedHTMLNotice2}`);

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

	test('Should extract the decimal interest rate for notice accounts', () => {
		const relevantRow = inputDOMNotice.window.document.querySelector('tr');
		const actual = extractors.rate(relevantRow);
		const {
			dataset: { rate },
		} = expectedDOMNotice.firstChild;
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
	test('Should extract the notice period when it exists', () => {
		const relevantRow = inputDOMNotice.window.document.querySelector('tr');
		const actual = extractors.noticePeriod(relevantRow);
		const {
			dataset: { notice },
		} = expectedDOMNotice.firstChild;
		expect(actual.dataset.notice).toBe(
			notice,
		);
	});
	test('Should support accounts without notice periods', () => {
		const relevantRow = inputDOM1.window.document.querySelector('tr');
		const actual = extractors.noticePeriod(relevantRow);
		expect(actual.dataset.notice).toBeUndefined();

	});
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

	test('Should support a single payment frequency for notice accounts', () => {
		const relevantRow = inputDOMNotice.window.document.querySelector('tr');
		const actual = extractors.paymentFrequency(relevantRow);
		const {
			dataset: { interestPaymentFrequency },
		} = expectedDOMNotice.firstChild;
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

	test('Should extract deposit limits for notice accounts', () => {
		const relevantRow = inputDOMNotice.window.document.querySelector('tr');
		const actual = extractors.deposits(relevantRow);
		const {
			dataset: { minDeposit, maxDeposit },
		} = expectedDOMNotice.firstChild;
		expect(actual.dataset.minDeposit).toBe(minDeposit);
		expect(actual.dataset.maxDeposit).toBe(maxDeposit);
	});
});

describe('How to open', () => {
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

	test('Should extract the "How to open" options for notice accounts', () => {
		const relevantRow = inputDOMNotice.window.document.querySelector('tr');
		const actual = extractors.howToOpen(relevantRow);
		const {
			dataset: { howToOpen },
		} = expectedDOMNotice.firstChild;
		expect(actual.dataset.howToOpen).toBe(howToOpen);
	});

	describe('How to open notes', () => {
		test('Should extract the "How to open" notes', () => {
			const relevantRow =
				inputDOMNotice.window.document.querySelector('tr');
			const actual = extractors.howToOpen(relevantRow);
			const {
				dataset: { howToOpenNotes },
			} = expectedDOMNotice.firstChild;
			expect(actual.dataset.howToOpenNotes).toBe(howToOpenNotes);
		});

		test.skip('Should flag "no joint" accounts', () => {});
	});
});
