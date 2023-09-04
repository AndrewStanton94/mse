const { consistentDeposit, consistentArray } = require('./utils');

/**
 * Match a percentage with 0..2 decimal places
 */
const percentageRegex = /\d+(\.\d{1,2})?%/;

/**
 * Extract the interest rate and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
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
 * Extract the interest payment frequency and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */
const paymentFrequency = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-3);

	const arrayOutput = consistentArray(textContent, /or|,/);
	const jsonOut = JSON.stringify(arrayOutput);
	inputRow.dataset.interestPaymentFrequency = jsonOut;
	return inputRow;
};

/**
 * Extract the minimum and maximum deposits save them to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */
const deposits = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-2);
	const [minD, maxD] = consistentArray(textContent, '/');

	inputRow.dataset.minDeposit = consistentDeposit(minD);
	inputRow.dataset.maxDeposit = consistentDeposit(maxD);
	return inputRow;
};

/**
 * Extract the ways the account can be created and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */
const howToOpen = (inputRow) => {
	const { textContent } = [...inputRow.querySelectorAll('td')].at(-1);

	const [waysToOpen, openingNotes] = textContent.split(/[()]/);
	console.log('openingNotes: ', openingNotes);

	const waysToOpenArray = consistentArray(waysToOpen, '/');
	const waysToOpenJSON = JSON.stringify(waysToOpenArray);
	inputRow.dataset.howToOpen = waysToOpenJSON;

	if (openingNotes) {
		const waysToOpenNotesArray = consistentArray(openingNotes, ',');
		const waysToOpenNotesJSON = JSON.stringify(waysToOpenNotesArray);
		inputRow.dataset.howToOpenNotes = waysToOpenNotesJSON;
	}

	return inputRow;
};

/**
 * Extract the required notice period and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */
const noticePeriod = (inputRow) => {
	const cells = [...inputRow.querySelectorAll('td')];
	if (cells.length === 6) {
		const { textContent } = cells[2];
		const days = parseInt(textContent);
		inputRow.dataset.notice = days;
	}
	return inputRow;
};

module.exports = {
	rate,
	paymentFrequency,
	deposits,
	howToOpen,
	noticePeriod,
};
