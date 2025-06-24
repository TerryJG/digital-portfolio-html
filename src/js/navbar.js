document.addEventListener("DOMContentLoaded", function () {
    const createNavbar = () => {
        // Create main elements
        const section = document.createElement('section');
        section.className = 'nav-wrapper text-center justify-content-center mb-3';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .nav-wrapper h1 { font-family: 'Fira Sans', sans-serif; margin-left: 2rem; }
            .nav-wrapper a { border-width: 1px; }
            .nav-wrapper p { font-family: 'Liberation Sans', sans-serif; margin-bottom: 0; }
            @media (max-width: 768px) {
                .nav-wrapper { flex-direction: column; }
                .nav-wrapper h1 { margin-left: 0; }
            }
        `;

        // Create nav element
        const nav = document.createElement('nav');
        nav.className = 'nav-wrapper bg-dark p-1 d-flex justify-content-between align-items-center fw-bold border-bottom rounded-bottom border-5';

        // Create title
        const h1 = document.createElement('h1');
        h1.className = 'nav-title text-white';
        h1.style.cssText = 'margin-top: 0.5rem; font-size: 2.5rem; cursor: default;';

        // Navigation links configuration
        const navLinks = [
            { href: '/index.html', iconClass: 'fa fa-home', text: 'Home' },
            { href: '/projects.html', iconClass: 'fa-solid fa-play', iconClass2: 'fa-solid fa-image', text: 'Projects' },
            { href: '/credits.html', iconClass: 'fa-solid fa-note-sticky', text: 'Credits' }
        ];

        // Page styles configuration
        const pageStyles = {
            'projects.html': {
                title: 'PROJECTS',
                buttonClass: 'btn-outline-warning',
                color: '#ffc107',
                borderClass: 'border-warning',
                hoverColor: '#202020'
            },
            'credits.html': {
                title: 'CREDITS',
                buttonClass: 'btn-outline-success',
                color: '#198754',
                borderClass: 'border-success',
                hoverColor: '#fff'
            }
        };

        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Set page-specific styles
        if (pageStyles[currentPage]) {
            const style = pageStyles[currentPage];
            h1.textContent = style.title;
            nav.classList.add(style.borderClass);
        }

        // Create navigation items wrapper
        const navbarItemsWrapper = document.createElement('div');
        navbarItemsWrapper.className = 'navbar-items-wrapper';

        // Create navigation links
        navLinks.forEach(link => {
            const a = document.createElement('a');
            a.className = `nav-${link.text.toLowerCase().replace(' ', '-')} btn`;
            a.href = link.href;

            // Style current page link
            if (link.href === currentPage) {
                const style = pageStyles[currentPage];
                if (style) {
                    a.classList.add(style.buttonClass);
                    a.style.color = style.color;
                    a.style.borderWidth = '0';

                    // Add hover effects
                    a.addEventListener('mouseover', () => a.style.color = style.hoverColor);
                    a.addEventListener('mouseout', () => a.style.color = style.color);
                }
            } else {
                a.classList.add('text-white');
            }

            // Add icons
            const icon1 = document.createElement('i');
            icon1.className = link.iconClass;
            icon1.setAttribute('aria-hidden', 'true');
            a.appendChild(icon1);

            if (link.iconClass2) {
                icon1.style.marginRight = '0.5rem';
                const icon2 = document.createElement('i');
                icon2.className = link.iconClass2;
                a.appendChild(icon2);
            }

            // Add text
            const p = document.createElement('p');
            p.textContent = link.text;
            a.appendChild(p);

            navbarItemsWrapper.appendChild(a);
        });

        // Assemble the navbar
        nav.appendChild(h1);
        nav.appendChild(navbarItemsWrapper);
        section.appendChild(style);
        section.appendChild(nav);

        return section;
    };

    // Insert navbar at the beginning of the body
    document.body.insertBefore(createNavbar(), document.body.firstChild);
});