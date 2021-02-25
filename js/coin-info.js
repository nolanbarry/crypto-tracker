function displayPlaceholder(hide) {
  let elements = document.querySelector('#coin-info').children;
  for(let el of elements) {
    if (el == document.querySelector('#placeholder'))
      el.style.display = hide ? 'none' : '';
    else
      el.style.display = hide ? '' : 'none' ;
  }
}

// called when page is reloaded or hash changes to update coin display info
let currentCoin = null;
function hashChange() {
  let symbol = document.location.hash;
  let c = coins.filter(x => "#" + x.symbol == symbol);
  let coin = null;
  if (c.length != 0) coin = c[0];
  if (symbol == undefined || symbol == '') {
    document.querySelector('#placeholder h1').innerHTML = "Choose a coin to get started!";
    displayPlaceholder(false);
  }
  else if (coin == undefined) {
    document.querySelector('#placeholder h1').innerHTML = "Sorry! We couldn't find that coin.";
    displayPlaceholder(false);
  }
  else {
    fillOutCoinInfo(coin);
    displayPlaceholder(true);
  }
}

window.addEventListener('hashchange', () => {
  clearCoin();
  hashChange();
});

function fillOutCoinInfo(coin) {
  currentCoin = coin;
  $('#coin-name')[0].innerHTML = coin.name;
  $('#coin-price')[0].innerHTML = beautify(truncateNumber(coin.price, 7));
  $('#coin-change')[0].innerHTML = numeral(coin.change).format('0.00');
  if (coin.change < 0) {
    $('#coin-change')[0].classList.remove('gain');
    $('#coin-change')[0].classList.add('loss');
    $('#coin-price')[0].classList.remove('header-gain');
    $('#coin-price')[0].classList.add('header-loss');
  } else {
    $('#coin-change')[0].classList.add('gain');
    $('#coin-change')[0].classList.remove('loss');
    $('#coin-price')[0].classList.add('header-gain');
    $('#coin-price')[0].classList.remove('header-loss');
  }
  createChart(coin.uuid, '24h');
  let coinDetailURL = `https://api.coinranking.com/v2/coin/${coin.uuid}`;
  retrieveCR(coinDetailURL).then(response => {
    return response.json();
  }).then(data => {
    let coin = data.data.coin;
    console.log(coin);
    let link = coin.links.reduce((a, b) => b.type == 'website' ? b : a);
    $('#marketcap')[0].innerHTML = numeral(coin.marketCap).format('$0,0.0a');
    $('#24hr-volume')[0].innerHTML = numeral(coin["24hVolume"]).format('0.00a');
    $('#all-time-high')[0].innerHTML = numeral(coin.allTimeHigh.price).format('$0,0.000')
    $('#website')[0].innerHTML = link.name;
    $('#website')[0].href = link.url;
  });
}

function clearCoin() {
  let f = '...'
  $('#marketcap')[0].innerHTML = f;
  $('#24hr-volume')[0].innerHTML = f;
  $('#all-time-high')[0].innerHTML = f;
  $('#website')[0].innerHTML = f;
  $('#website')[0].href = '';
}

animateTextShake()
function animateTextShake() {
  let r = (l, h) => Math.floor(Math.random() * (h-l + 1)) + l;
  let anim = function() {
    let coin = currentCoin;
    if (coin == null) return;
    let priceAccent = `rgba(${(coin.change <= 0)*200}, ${(coin.change >= 0)*200}, 0,`;
    //$('#coin-name')[0].style.textShadow = `${r(-4, 4)}px ${r(-1, 1)}px ${3}px ${priceAccent} ${r(5, 7)/10})`;
    if (coin.change > 0) {
      $('#coin-price')[0].style.textShadow = `${r(-4, 4)}px ${r(-1, 1)}px ${3}px ${priceAccent} ${r(5, 7)/10})`;
    } else {
      $('#coin-price')[0].style.textShadow = `${r(-3, 3)}px ${r(-1, 1)}px ${5}px ${priceAccent} ${r(3, 5)/10})`;
    }
  }
  setInterval(() => requestAnimationFrame(anim), 75);
}
