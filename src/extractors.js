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

module.exports = {
	rate,
};
