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

module.exports = {
	consistentDeposit,
};
