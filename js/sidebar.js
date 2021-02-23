let sidebar = document.querySelector('#sidebar');
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
  if (currentScroll <= 0) {
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

// call to cade search clear button fade in and out
let maxOpacity = 0.3
let fade = {fadeIn: false, running: false};
function searchClearFade(fadeIn) {
  fade.fadeIn = fadeIn;
  console.log(fade.running);
  function fadeAnim(currentTime, oldTime) {
    fade.running = true;
    if (oldTime == null) oldTime = currentTime;
    let target = fade.fadeIn ? maxOpacity : 0;
    let img = document.querySelector('#sidebar-search-clear img');
    img.style.opacity = Number(img.style.opacity) + (currentTime - oldTime) / 300 * (fade.fadeIn ? 1 : -1);
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
