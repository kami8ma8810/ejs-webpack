const width = document.documentElement.clientWidth;
$$('*').forEach((el) => {
  el.style.outline = '1px solid tomato';
  if (width < el.clientWidth) {
    console.log(el);
  }
});
