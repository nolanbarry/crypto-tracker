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
    search.classList.remove(scrollUp);
    search.classList.add(scrollDown);
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
  console.log(searchText);
  for(let coin of coins) {
    if (searchText == '') {
      document.getElementById(coin.symbol).style.display = 'initial';
      continue;
    }
    let key = (coin.name + coin.symbol).toUpperCase();
    if(key.includes(searchText))
      document.getElementById(coin.symbol).style.display = 'initial';
    else
      document.getElementById(coin.symbol).style.display = 'none';
  }
}
document.querySelector('#sidebar-search').addEventListener('keyup', performSearchFiltering, false);
document.querySelector('#sidebar-search').addEventListener('change', performSearchFiltering, false);
