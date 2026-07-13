// navigation.js — responsive hamburger menu toggle

const hamburger = document.getElementById('hamburger');
const menuList = document.querySelector('.menu-list');

hamburger.addEventListener('click', () => {
    menuList.classList.toggle('open');
});

// Allow keyboard activation (Enter / Space) since the hamburger is a div with role="button"
hamburger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        menuList.classList.toggle('open');
    }
});