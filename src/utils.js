/**
 *
 * @param {string} depositString string representing the min or max deposit
 * @returns {string} consistent form of the deposit
 */
const consistentDeposit = (depositString) => {
	return depositString
		.replace('£', '')
		.replace(',', '_')
		.replace('m', '_000_000')
		.trim();
};

/**
 *
 * @param {string} textContent The text extracted from the DOM
 * @param {RegExp|string} separator Where to split the string
 * @returns {string[]} Lowercase values without stray spaces
 */
const consistentArray = (textContent, separator) => {
	return textContent
		.toLowerCase()
		.split(separator)
		.map((item) => item.trim());
};

module.exports = {
	consistentDeposit,
	consistentArray,
};
