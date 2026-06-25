// Kupkop PH — shared scripts
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var menuBtn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () { links.classList.toggle('open'); });
  }
});
