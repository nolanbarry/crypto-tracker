let search = document.querySelector('#sidebar-search-container');
// resizes sidebar height when window is resized
function resizeSidebar() {
  sidebar.style.height = window.innerHeight - document.getElementById('header').clientHeight + "px";
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

function performSearchFiltering() {
  let listings = sidebar.getElementsByClassName('sidebar-listing');
  let searchText = document.querySelector('#sidebar-search').value.toUpperCase();
  if (searchText == '')
    searchClearFade(false);
  else
    searchClearFade(true);
  for(let coin of coins) {
    if (searchText == '') {
      document.getElementById(coin.symbol).style.display = 'initial';
      continue;
    }
    sidebar.scrollTop = 0;
    let key = (coin.name + coin.symbol).toUpperCase();
    if(key.includes(searchText))
      document.getElementById(coin.symbol).style.display = 'initial';
    else
      document.getElementById(coin.symbol).style.display = 'none';
  }
}
document.querySelector('#sidebar-search').addEventListener('keyup', performSearchFiltering, false);
document.querySelector('#sidebar-search').addEventListener('change', performSearchFiltering, false);

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
    if (fade.fadeIn && img.style.opacity > target) img.style.opacity = target;
    else if (!fade.fadeIn && img.style.opacity <= 0) img.style.opacity = 0;
    if (img.style.opacity == target) {
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
      filterBox.style.left = sidebar.clientWidth + "px";
      filterBox.style.top = document.querySelector('#header').clientHeight + 10 + 'px';
      filterBox.style.margin = '0';
      sidebar.after(filterBox);
      filterBox.classList.remove('closed');
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
      filterBox.classList.add('closed');
    }
  }
});
// clear filters button
document.querySelector('#filter-clear').addEventListener('click', () => {
  values = document.getElementsByClassName('filter-value');
  for(let element of values) {
    element.value = '';
  }
})
// filter slide animation
let filterSlide = {slideOut: false, running: false, margin: 0};
function slideFilterBox(slide) {
  if(slide) {
    filterBox.classList.remove('closed');
    filterBox.style.marginTop = "-" + (filterBox.clientHeight) + "px";
  }
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
