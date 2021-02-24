let search = document.querySelector('#sidebar-search-container');
// resizes sidebar height when window is resized
function resizeSidebar() {
  document.querySelector('#main-body').style.height = window.innerHeight - document.getElementById('header').clientHeight + "px";
}
window.addEventListener('resize', resizeSidebar);
resizeSidebar();

// pseudo-sticky search bar
const body = document.body;
const scrollUp = "scroll-up";
const scrollDown = "scroll-down";
let lastScroll = 0;

sidebar.addEventListener('scroll', () => {
  search.style.top = sidebar.scrollTop + "px";
  const currentScroll = sidebar.scrollTop;
  if (currentScroll <= 0 ||
    (document.querySelector('#filter').style.display = 'initial' &&
    currentScroll <= document.querySelector('#filter').clientHeight)) {
    search.classList.remove(scrollUp);
    return;
  }

  if (currentScroll > lastScroll && !search.classList.contains(scrollDown)) {
    // down
    if (searchText = document.querySelector('#sidebar-search').value == '') {
      search.classList.remove(scrollUp);
      search.classList.add(scrollDown);
      search.querySelector('#sidebar-search').blur();
    }
  } else if (currentScroll < lastScroll && search.classList.contains(scrollDown)) {
    // up
    search.classList.remove(scrollDown);
    search.classList.add(scrollUp);
  }
  lastScroll = currentScroll;
});

// choose a coin
function coinChoose(coin) {

}

function performSearchFiltering() {
  let listings = sidebar.getElementsByClassName('sidebar-listing');
  let searchText = document.querySelector('#sidebar-search').value.toUpperCase();
  sidebar.scrollTop = 0;
  if (searchText == '')
    searchClearFade(false);
  else
    searchClearFade(true);
  for(let coin of coins) {
    let included = true;
    if (searchText != '') { // text
      let key = (coin.name + coin.symbol).toUpperCase();
      if(!key.includes(searchText)) included = false;
    }
    let getDec = str => {
      let s = str.split('.');
      if (s == null || s.length < 2) return 0;
      else return s[1].length;
    }
    let priceFilter = document.querySelector('#price-filter-value').value;
    if (priceFilter != '') {
      let operator = document.querySelector('#price-filter-operator').value;
      if(operator == 'lt') { if (coin.price > Number(priceFilter)) included = false; }
      else if (operator == 'gt') { if (coin.price < Number(priceFilter)) included = false; }
      else if (operator == 'e') { if (truncateDecimal(coin.price, getDec(priceFilter)) != Number(priceFilter)) included = false; }
    }
    let changeFilter = document.querySelector('#change-filter-value').value;
    if (changeFilter != '') {
      let operator = document.querySelector('#change-filter-operator').value;
      if(operator == 'lt') { if (coin.change > Number(changeFilter)) included = false; }
      else if (operator == 'gt') { if (coin.change < Number(changeFilter)) included = false; }
      else if (operator == 'e') { if (truncateDecimal(coin.change, getDec(changeFilter)) != Number(changeFilter)) included = false; }
    }
    let capFilter = document.querySelector('#cap-filter-value').value;
    if (capFilter != '') {
      let operator = document.querySelector('#cap-filter-operator').value;
      if(operator == 'lt') { if (coin.marketCap > Number(capFilter)) included = false; }
      else if (operator == 'gt') { if (coin.marketCap < Number(capFilter)) included = false; }
      else if (operator == 'e') { if (truncateDecimal(coin.marketCap, getDec(capFilter)) != Number(capFilter)) included = false; }
    }
    if (priceFilter + changeFilter + capFilter != '') {
      console.log('yo');
      document.querySelector('#sidebar-search-filter-toggle').style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    } else {
      document.querySelector('#sidebar-search-filter-toggle').style.boxShadow = '';
    }
    if(included)
      document.getElementById(coin.symbol).style.display = 'initial';
    else document.getElementById(coin.symbol).style.display = 'none';
  }
}
document.querySelector('#sidebar-search').addEventListener('keyup', performSearchFiltering);
document.querySelector('#sidebar-search').addEventListener('change', performSearchFiltering);
document.querySelector('#price-filter-value').addEventListener('keyup', performSearchFiltering);
document.querySelector('#price-filter-operator').addEventListener('change', performSearchFiltering);
document.querySelector('#change-filter-value').addEventListener('keyup', performSearchFiltering);
document.querySelector('#change-filter-operator').addEventListener('change', performSearchFiltering);
document.querySelector('#cap-filter-value').addEventListener('keyup', performSearchFiltering);
document.querySelector('#cap-filter-operator').addEventListener('change', performSearchFiltering);


document.querySelector('#sidebar-search-clear').addEventListener('click', () => {
  document.querySelector('#sidebar-search').value = '';
  document.querySelector('#sidebar-search').blur();
  performSearchFiltering();
});

// call to fade search clear button in and out
let maxOpacity = 0.3
let fade = {fadeIn: false, running: false};
function searchClearFade(fadeIn) {
  fade.fadeIn = fadeIn;
  function fadeAnim(currentTime, oldTime) {
    fade.running = true;
    if (oldTime == null) oldTime = currentTime;
    let target = fade.fadeIn ? maxOpacity : 0;
    let img = document.querySelector('#sidebar-search-clear img');
    img.style.opacity = Number(img.style.opacity) + (currentTime - oldTime) / 500 * (fade.fadeIn ? 1 : -1);
    if (Math.abs(img.style.opacity - target) < 0.1) {
      img.style.opacity = target;
      fade.running = false;
    } else requestAnimationFrame(newTime => fadeAnim(newTime, currentTime));
  }
  if (!fade.running) {
    requestAnimationFrame(fadeAnim);
  }
}

/*** sidebar filter ***/
let filterBox = document.querySelector('#filter');
// show/hide filters
document.querySelector('#sidebar-search-filter-toggle').addEventListener('click', () => {
  if (filterBox.classList.contains('closed')) {
    // open filters
    // desktop
    if (window.innerWidth > 600) {
      filterBox.style.position = 'fixed';
      filterBox.style.left = sidebar.clientWidth + 20 + "px";
      filterBox.style.top = document.querySelector('#header').clientHeight + 10 + 'px';
      filterBox.style.margin = '0';
      sidebar.after(filterBox);
      fadeFilterBox(true);
    } // mobile
    else {
      filterBox.style.margin = '10px';
      filterBox.style.position = 'static';
      search.after(filterBox);
      slideFilterBox(true);
    }
  } else {
    // close filters
    if (window.innerWidth <= 600) {
      slideFilterBox(false);
    } else {
      fadeFilterBox(false);
    }
  }
});
// clear filters button
document.querySelector('#filter-clear').addEventListener('click', () => {
  values = document.getElementsByClassName('filter-value');
  for(let element of values) {
    element.value = '';
  }
  performSearchFiltering();
})
// filter slide animation for mobile styles only
let filterSlide = {slideOut: false, running: false, margin: 0};
function slideFilterBox(slide) {
  if(slide) {
    filterBox.classList.remove('closed');
    filterBox.style.marginTop = "-" + (filterBox.clientHeight) + "px";
  }
  filterBox.style.opacity = 1;
  let targetPosition = filterBox.clientHeight + 20;
  filterSlide.slideOut = slide;
  function slideAnim() {
    filterSlide.running = true;
    let target = filterSlide.slideOut ? targetPosition : 0;
    filterSlide.margin += (target - filterSlide.margin) / 4;
    filterBox.style.marginTop = -1 * (targetPosition - filterSlide.margin - 10) + "px";
    if (Math.abs(target - filterSlide.margin) < 0.1) {
      filterSlide.margin = target;
      filterBox.style.marginTop = -1 * (targetPosition - filterSlide.margin - 10) + "px";
      filterSlide.running = false;
      if (filterSlide.margin == 0) {
        filterBox.classList.add('closed');
      }
    } else requestAnimationFrame(slideAnim);
  }
  if (!filterSlide.running) {
    requestAnimationFrame(slideAnim);
  }
}

// filter fade animation for non-mobile styles
let filterFade = {fadeIn: false, running: false}
function fadeFilterBox(fadeIn) {
  if(fadeIn) {
    filterBox.style.opacity = 0;
    filterBox.classList.remove('closed');
    filterBox.focus();
  }
  filterFade.fadeIn = fadeIn;
  function fadeAnim(currentTime, oldTime) {
    filterFade.running = true;
    if (oldTime == null) oldTime = currentTime;
    let target = filterFade.fadeIn ? 1 : 0;
    filterBox.style.opacity = Number(filterBox.style.opacity) + (currentTime - oldTime) / 75 * (filterFade.fadeIn ? 1 : -1);
    if (Math.abs(filterBox.style.opacity) > 1) {
      filterBox.style.opacity = target;
      filterFade.running = false;
      if (!filterFade.fadeIn) filterBox.classList.add('closed');
    } else requestAnimationFrame(newTime => fadeAnim(newTime, currentTime));
  }
  if (!filterFade.running) {
    requestAnimationFrame(fadeAnim);
  }
}
