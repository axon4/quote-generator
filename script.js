const loader = document.getElementById('loader');
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const TwitterButton = document.getElementById('Twitter');
const newQuoteButton = document.getElementById('quote-new');
let queryLimit = 0;

function showLoader() {
	loader.hidden = false;
	quoteContainer.hidden = true;
};

function hideLoader() {
	if (!loader.hidden) {
		quoteContainer.hidden = false;
		loader.hidden = true;
	};
};

async function getQuote() {
	showLoader();

	const API = 'https://type.fit/api/quotes';

	try {
		// limit API-call--retries and disPlay error-message
		if (queryLimit > 19) {
			quoteText.innerText = 'Error Retrieving Quote; ReFresh or Try AGain Later';
			authorText.innerText = 'System';
			newQuoteButton.innerText = 'ReFresh';
		} else {
			const response = await fetch(API);
			const quotes = await response.json();
			const quote = quotes[Math.ceil(Math.random() * Math.floor(quotes.length))];

			// reduce font-size for long quotes
			if (quote.text.length > 120) {
				quoteText.classList.add('quote-long');
			} else {
				quoteText.classList.remove('quote-long');
			};

			quoteText.innerText = quote.text;

			if (quote.author === 'type.fit') {
				authorText.innerText = 'UnKnown';
			} else if (quote.author.includes('Ralph Emerson')) {
				quote.author = 'Ralph Waldo Emerson';
			} else {
				authorText.innerText = quote.author.split(',')[0];
			};
		};

		hideLoader();
	} catch (error) {
		queryLimit++;

		getQuote();
		console.log(error);
	};
};

function tweetQuote() {
	const quote = quoteText.innerText;
	const author = authorText.innerText;
	const Twitter = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;

	window.open(Twitter, '_blank');
};

// event-listeners
TwitterButton.addEventListener('click', tweetQuote);
newQuoteButton.addEventListener('click', function () {
	if (queryLimit <= 19) {
		getQuote();
	} else {
		newQuoteButton.innerText = 'ReFresh';

		window.location.reload();
	};
});

// grab quote upOn-load
getQuote();