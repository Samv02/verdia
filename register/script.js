document.addEventListener('DOMContentLoaded', function() {
  // Scroll event listener for sticky header
  window.addEventListener("scroll", () => {
      const header = document.querySelector(".header");
      if (header) {
          header.classList.toggle("sticky", window.scrollY > 0);
      }
  });

  // Hamburger menu and off-screen menu
  const hamMenu = document.querySelector(".ham-menu");
  const offScreenMenu = document.querySelector(".off-screen-menu");
  const searchbar = document.querySelector(".search-bar");
  const offScreenSearch = document.querySelector(".off-screen-search");

  // Check if elements exist before adding event listeners
  if (hamMenu && offScreenMenu && searchbar && offScreenSearch) {
      hamMenu.addEventListener("click", () => {
          hamMenu.classList.toggle("active");
          offScreenMenu.classList.toggle("active");
      });

      searchbar.addEventListener("click", () => {
          searchbar.classList.toggle("active");
          offScreenSearch.classList.toggle("active");
      });
  }

  // Search icon elements
  const iconBlack = document.getElementById('iconBlack');
  const iconWhite = document.getElementById('iconWhite');
  const closeIcon = document.getElementById('closeIcon');

  // Function to hide iconBlack and iconWhite, and show closeIcon
  function showCloseIcon() {
      iconBlack.style.display = 'none';
      iconWhite.style.display = 'none';
      closeIcon.style.display = 'block';
  }

  // Function to hide closeIcon, and show iconBlack and iconWhite
  function showIcons() {
      iconBlack.style.display = 'block';
      iconWhite.style.display = 'block';
      closeIcon.style.display = 'none';
  }

  // Add event listeners to toggle icons
  if (iconBlack && iconWhite && closeIcon) {
      iconBlack.addEventListener('click', showCloseIcon);
      iconWhite.addEventListener('click', showCloseIcon);
      closeIcon.addEventListener('click', showIcons);
  }
});
