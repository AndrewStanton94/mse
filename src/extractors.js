const { consistentDeposit, consistentArray } = require('./utils');

const percentageRegex = /\d+(\.\d)?%/;

/**
 *
 * @param {HTMLTableRowElement} inputRow
 */
const rate = (inputRow) => {
	// Info in the second column
	const textContent = inputRow.querySelectorAll('td')[1].textContent.trim();

	const extractedPercentage = textContent.match(percentageRegex)[0];
	const remainingText = textContent.replace(percentageRegex, '').trim();

	inputRow.dataset.rate = extractedPercentage.slice(0, -1);
	inputRow.dataset.rateQualifier = remainingText;
	return inputRow;
};

/**
 *
 * @param {HTMLTableRowElement} inputRow
 */
const paymentFrequency = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-3);

	const arrayOutput = consistentArray(textContent, /or|,/);
	const jsonOut = JSON.stringify(arrayOutput);
	inputRow.dataset.interestPaymentFrequency = jsonOut;
	return inputRow;
};

/**
 *
 * @param {HTMLTableRowElement} inputRow
 */
const deposits = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-2);
	const [minD, maxD] = consistentArray(textContent, '/');

	inputRow.dataset.minDeposit = consistentDeposit(minD);
	inputRow.dataset.maxDeposit = consistentDeposit(maxD);
	return inputRow;
};

/**
 *
 * @param {HTMLTableRowElement} inputRow
 */
const howToOpen = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-1);

	const arrayOutput = consistentArray(textContent, '/');
	const jsonOut = JSON.stringify(arrayOutput);
	inputRow.dataset.howToOpen = jsonOut;

	return inputRow;
};

module.exports = {
	rate,
	paymentFrequency,
	deposits,
	howToOpen,
};
