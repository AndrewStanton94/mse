# Money Saving Expert: Interest rate filter

A bookmarklet to filter results on the MoneySavingExpert Savings Accounts page.

Martin Lewis has a lot of valuable information on his website but the tables on the [Savings Accounts page](https://www.moneysavingexpert.com/savings/savings-accounts-best-interest/) can't be filtered. I want to create a bookmarklet (a bookmark that runs code) to prune out results that aren't a good fit for me.

This is a useful opportunity for me to practise Test Driven Development as I haven't used this approach consistently before.

## Intended strategy

-   On bookmarklet run:
    -   Extract cell data and add as attributes to the row
    -   Add a bar with filters
-   Interacting with the filter bar will update the applied filters
-   Each filter that rejects will add a class to the row
-   There will be a different class for each type of rejection, useful for diagnosis but they will all just hide the unsuitable rows through CSS.

## Steps

1. Install [Jest](https://jestjs.io) and [jsdom](https://github.com/jsdom/jsdom)
2. Write unit tests for attribute extraction
3. Write code to make the above tests pass
4. Write a loader script that will fetch the above code
5. Write tests for filter functions
6. Write the filter functions
7. Write the CSS (production and test)
8. Write tests for the filter panel
9. Build the filter panel
