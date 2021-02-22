// add links to stylesheets to page
function createStylesheetLink(path) {
  let ss = document.createElement('link');
  ss.rel = 'stylesheet';
  ss.href = `css/${path}.css`;
  return ss;
}
let head = document.head;
head.appendChild(createStylesheetLink('styles'));
head.appendChild(createStylesheetLink('header'));
head.appendChild(createStylesheetLink('sidebar'));

// resize sidebar height when page is resized
function setSidebarHeight() {
  let sidebar = document.getElementById('sidebar');
  let header = document.getElementById('header');
  sidebar.style.height = window.innerHeight - header.clientHeight + 'px';
}
document.body.addEventListener("resize", setSidebarHeight);
setSidebarHeight(); // initalize