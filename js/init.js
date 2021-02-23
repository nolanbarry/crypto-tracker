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

function resizeSidebar() {
  let sidebar = document.getElementById('sidebar');
  console.log(`document height ${window.innerHeight} - header height ${document.getElementById('header').clientHeight} = ${window.innerHeight - document.getElementById('header').clientHeight}`);
  sidebar.style.height = window.innerHeight - document.getElementById('header').clientHeight + "px";
}
window.addEventListener('resize', resizeSidebar);
console.log('calling resize:');
resizeSidebar();
