// source : https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb

function resizeGridItem(item) {
  const grid = document.querySelector('.grid-container');
  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
  );
  const rowSpan = Math.ceil(
    (item.querySelector('.article-content').getBoundingClientRect().height + rowGap) /
      (rowHeight + rowGap)
  );
  item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems() {
  const allItems = document.querySelector('article.article');

  allItems.forEach((item, i) => resizeGridItem(allItems[i]))

  // for (x = 0; x < allItems.length; x++) {
  //   resizeGridItem(allItems[x]);
  // }
}

function resizeInstance(instance) {
  const item = instance.elements[0];
  resizeGridItem(item);
}

window.onload = resizeAllGridItems();
window.addEventListener('resize', resizeAllGridItems);

allItems = document.getElementsByClassName('item');
for (x = 0; x < allItems.length; x++) {
  imagesLoaded(allItems[x], resizeInstance);
}
