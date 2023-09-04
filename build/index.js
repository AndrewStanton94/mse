var $269e82afc8224d1b$exports = {};
var $4559ecf940edc78d$exports = {};
/**
 *
 * @param {string} depositString string representing the min or max deposit
 * @returns {string} consistent form of the deposit
 */ const $4559ecf940edc78d$var$consistentDeposit = (depositString)=>{
    return depositString.replace("\xa3", "").replace(",", "_").replace("m", "_000_000").trim();
};
/**
 *
 * @param {string} textContent The text extracted from the DOM
 * @param {RegExp|string} separator Where to split the string
 * @returns {string[]} Lowercase values without stray spaces
 */ const $4559ecf940edc78d$var$consistentArray = (textContent, separator)=>{
    return textContent.toLowerCase().split(separator).map((item)=>item.trim());
};
$4559ecf940edc78d$exports = {
    consistentDeposit: $4559ecf940edc78d$var$consistentDeposit,
    consistentArray: $4559ecf940edc78d$var$consistentArray
};


var $269e82afc8224d1b$require$consistentDeposit = $4559ecf940edc78d$exports.consistentDeposit;
var $269e82afc8224d1b$require$consistentArray = $4559ecf940edc78d$exports.consistentArray;
/**
 * Match a percentage with 0..2 decimal places
 */ const $269e82afc8224d1b$var$percentageRegex = /\d+(\.\d{1,2})?%/;
/**
 * Extract the interest rate and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */ const $269e82afc8224d1b$var$rate = (inputRow)=>{
    // Info in the second column
    const textContent = inputRow.querySelectorAll("td")[1].textContent.trim();
    const extractedPercentage = textContent.match($269e82afc8224d1b$var$percentageRegex)[0];
    const remainingText = textContent.replace($269e82afc8224d1b$var$percentageRegex, "").trim();
    inputRow.dataset.rate = extractedPercentage.slice(0, -1);
    inputRow.dataset.rateQualifier = remainingText;
    return inputRow;
};
/**
 * Extract the interest payment frequency and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */ const $269e82afc8224d1b$var$paymentFrequency = (inputRow)=>{
    const { textContent: textContent } = [
        ...inputRow.querySelectorAll("td")
    ].at(-3);
    const arrayOutput = $269e82afc8224d1b$require$consistentArray(textContent, /or|,/);
    const jsonOut = JSON.stringify(arrayOutput);
    inputRow.dataset.interestPaymentFrequency = jsonOut;
    return inputRow;
};
/**
 * Extract the minimum and maximum deposits save them to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */ const $269e82afc8224d1b$var$deposits = (inputRow)=>{
    const { textContent: textContent } = [
        ...inputRow.querySelectorAll("td")
    ].at(-2);
    const [minD, maxD] = $269e82afc8224d1b$require$consistentArray(textContent, "/");
    inputRow.dataset.minDeposit = $269e82afc8224d1b$require$consistentDeposit(minD);
    inputRow.dataset.maxDeposit = $269e82afc8224d1b$require$consistentDeposit(maxD);
    return inputRow;
};
/**
 * Extract the ways the account can be created and save it to the row as a data value
 *
 * @param {HTMLTableRowElement} inputRow
 * @returns {HTMLTableRowElement}
 */ const $269e82afc8224d1b$var$howToOpen = (inputRow)=>{
    const { textContent: textContent } = [
        ...inputRow.querySelectorAll("td")
    ].at(-1);
    const [waysToOpen, openingNotes] = textContent.split(/[()]/);
    console.log("openingNotes: ", openingNotes);
    const waysToOpenArray = $269e82afc8224d1b$require$consistentArray(waysToOpen, "/");
    const waysToOpenJSON = JSON.stringify(waysToOpenArray);
    inputRow.dataset.howToOpen = waysToOpenJSON;
    if (openingNotes) {
        const waysToOpenNotesArray = $269e82afc8224d1b$require$consistentArray(openingNotes, ",");
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
 */ const $269e82afc8224d1b$var$noticePeriod = (inputRow)=>{
    const cells = [
        ...inputRow.querySelectorAll("td")
    ];
    if (cells.length === 6) {
        const { textContent: textContent } = cells[2];
        const days = parseInt(textContent);
        inputRow.dataset.notice = days;
    }
    return inputRow;
};
$269e82afc8224d1b$exports = {
    rate: $269e82afc8224d1b$var$rate,
    paymentFrequency: $269e82afc8224d1b$var$paymentFrequency,
    deposits: $269e82afc8224d1b$var$deposits,
    howToOpen: $269e82afc8224d1b$var$howToOpen,
    noticePeriod: $269e82afc8224d1b$var$noticePeriod
};


var $4fa36e821943b400$require$rate = $269e82afc8224d1b$exports.rate;
var $4fa36e821943b400$require$paymentFrequency = $269e82afc8224d1b$exports.paymentFrequency;
var $4fa36e821943b400$require$deposits = $269e82afc8224d1b$exports.deposits;
var $4fa36e821943b400$require$howToOpen = $269e82afc8224d1b$exports.howToOpen;
var $4fa36e821943b400$require$noticePeriod = $269e82afc8224d1b$exports.noticePeriod;
const $4fa36e821943b400$var$processARow = (row)=>{
    $4fa36e821943b400$require$rate($4fa36e821943b400$require$paymentFrequency($4fa36e821943b400$require$deposits($4fa36e821943b400$require$howToOpen($4fa36e821943b400$require$noticePeriod(row)))));
};
[
    ...document.querySelectorAll("tr:has(td a[href])")
].map($4fa36e821943b400$var$processARow);


//# sourceMappingURL=index.js.map
