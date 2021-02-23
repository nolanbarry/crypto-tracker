// on page load:

/* https://www.coingecko.com/en/api */
/* https://developers.coinranking.com/api/documentation/ */
let coinRankKey = 'coinranking0c56a9b857f065ff49e44335d35cdb0b328a7c22e16b269d';
let coinRankAllURL = 'https://api.coinranking.com/v2/coins';
let coins;
fetch(coinRankAllURL, {headers: { 'x-access-token': coinRankKey }})
.then(function(response) {
  return response.json();
}).then(function(data) {
  coins = data.data.coins;
  let sidebar = document.getElementById('sidebar');
  for(let coin of coins) {
    sidebar.appendChild(createCoinSidebarListing(coin));
  }
});

/*** HELPER FUNCTIONS ***/
// function to create an element
// options is an object with properties of element
function element(type, options, ...children) {
  let element = document.createElement(type);
  for(let key of Object.keys(options)) {
    element[key] = options[key];
  }
  for(let child of children) {
    element.appendChild(child);
  }
  return element;
}

function determineCoinChangeClass(change) {
  change = truncateDecimal(change, 2);
  if (change < 0) return 'loss';
  if (change > 0) return 'gain';
  return 'no-change';
}

function truncateNumber(price, totalDigitCount) {
  if (Number.isInteger(price)) return price;
  ++totalDigitCount; // account for decimal as character
  return price.slice(0, totalDigitCount + 1);
}

function truncateDecimal(value, decimals) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function beautify(num) {
  return num.toLocaleString(undefined,  { minimumFractionDigits: 2 });
}

function createCoinSidebarListing(coin) {
  // heading
  let name = element('h1', {className: 'sidebar-name', innerHTML: coin.name});
  let abbrev = element('h1', {className: 'sidebar-abbrev', innerHTML: coin.symbol});
  let heading = element('div', {className: 'container sidebar-heading'}, name, abbrev);
  // subheading
  let price = element('h2', {className: 'sidebar-price', innerHTML: beautify(truncateNumber(coin.price, 7))});
  let percentChange = element('h2', {innerHTML: beautify(truncateDecimal(Math.abs(coin.change), 2)), className: 'sidebar-change ' + determineCoinChangeClass(coin.change)});
  let subheading = element('div', {className: 'container price-subheading'}, price, percentChange);
  // combine into listing
  let listing = element('a', {className: 'sidebar-listing', id: coin.symbol, href: `#${coin.symbol}`}, heading, subheading);
  return listing;
}

function updateCoinPrice(coin) {
  let listing = document.getElementById(coin.symbol);
}
