document.addEventListener('DOMContentLoaded', function() {
    const animationStyles = document.getElementById('animation-styles');
    animationStyles.removeAttribute('disabled');
});



document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#nav-link');
    const homeLink = document.querySelector('nav a[href="/public/index.html"]');

    function clearActiveState() {
        navLinks.forEach(link => link.classList.remove('active'));
        sessionStorage.removeItem('activePage');
    }

    // Check if we're on the index page
    if (currentPage === '' || currentPage === 'index.html') {
        clearActiveState();
    } else {
        const activePage = sessionStorage.getItem('activePage');
        if (activePage) {
            const activeLink = document.querySelector(`#nav-link[href*="${activePage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    navLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }

        link.addEventListener('click', function(event) {
            clearActiveState();
            this.classList.add('active');
            sessionStorage.setItem('activePage', this.getAttribute('href'));
        });
    });

    // Add click event to home link (h1)
    if (homeLink) {
        homeLink.addEventListener('click', function(event) {
            clearActiveState();
        });
    }
});