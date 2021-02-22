// on page load:
let allListURL = "https://api.coingecko.com/api/v3/coins/list";
let allCoins = {};
fetch(allListURL)
  .then(function(response) {
    return response.json();
  }).then(function(data) {

  })