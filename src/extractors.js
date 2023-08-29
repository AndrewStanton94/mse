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
	const textContent = inputRow
		.querySelectorAll('td')[2]
		.textContent.toLowerCase();

	const arrayOutput = textContent
		.split(/or|,/)
		.map((frequency) => frequency.trim());
	const jsonOut = JSON.stringify(arrayOutput);
	inputRow.dataset.interestPaymentFrequency = jsonOut;
	return inputRow;
};

module.exports = {
	rate,
	paymentFrequency,
};
