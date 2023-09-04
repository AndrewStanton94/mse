const {
	rate,
	paymentFrequency,
	deposits,
	howToOpen,
	noticePeriod,
} = require('./extractors');

const processARow = (row) => {
	rate(paymentFrequency(deposits(howToOpen(noticePeriod(row)))));
};

[...document.querySelectorAll('tr:has(td a[href])')].map(processARow);
