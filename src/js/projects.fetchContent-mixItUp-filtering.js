import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? '' // Empty string for production
  : 'http://localhost:3000'; // Development server URL

class PortfolioDB {
  constructor() {
    this.categories = [];
    this.videos = [];
    this.images = [];
    this.web = [];
    this.initialized = false;
    this.currentCategoryId = null;
    this.mixer = null;
  }

  toggleLoadingSpinner(show) {
    const spinner = document.querySelector('#loading-spinner');
    if (spinner) {
      spinner.style.display = show ? 'flex' : 'none';
    }
  }

  async waitForDependencies() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20;
      const checkDependencies = () => {
        if (typeof mixitup !== 'undefined') {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('MixItUp dependency not loaded'));
        } else {
          attempts++;
          setTimeout(checkDependencies, 250);
        }
      };
      checkDependencies();
    });
  }

  showErrorMessage(message) {
    const container = document.querySelector('.portfolio-container');
    if (container) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger';
      errorDiv.role = 'alert';
      errorDiv.textContent = message;
      container.prepend(errorDiv);

      setTimeout(() => this.removeErrorMessage(), 5000); // Remove error after 5 seconds
    }
  }

  async initialize() {
    try {
      this.toggleLoadingSpinner(true);
      await this.waitForDependencies();

      const [categoriesResponse, videosResponse, imagesResponse, webResponse] = await Promise.all([
        axios.get(`${baseURL}/portfolio/categoryInfo`),
        axios.get(`${baseURL}/portfolio/videos`),
        axios.get(`${baseURL}/portfolio/images`),
        axios.get(`${baseURL}/portfolio/web`)
      ]);

      this.categories = categoriesResponse.data;
      this.videos = videosResponse.data;
      this.images = imagesResponse.data;
      this.web = webResponse.data;

      
      this.renderContentGrid();
      this.renderCategoryButtons();
      this.initializeMixItUp();
      this.initializeNavigation();
      this.initializeEventListeners();

      this.initialized = true;
      this.toggleLoadingSpinner(false);
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      this.toggleLoadingSpinner(false);
      this.showErrorMessage('Failed to load portfolio content.');
    }
  }


  renderContentGrid() {
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (!gridWrapper) {
      console.error('Grid wrapper not found');
      return;
    }

    let html = '';

    // Combine and sort all content
    const allContent = [
      ...this.videos.filter(video => !video.isArchived),
      ...this.images.filter(image => !image.isArchived),
      ...this.web.filter(web => !web.isArchived)
    ].sort((a, b) => {
      const dateA = new Date(a['data-date']);
      const dateB = new Date(b['data-date']);
      return dateB - dateA;
    });

    // Render all content
    allContent.forEach(item => {
      const category = this.categories.find(c => c._id === item.categoryId);
      const categoryClass = category
        ? category.abbreviatedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')
        : '';

      if (item.contentType === 'video') {
        const featuredClass = item.isFeatured ? 'big' : '';
        html += `
          <div class="mix lc-block video-item fancybox overflow-hidden rounded ${featuredClass} ${categoryClass}" 
               data-fancybox="${item.dataFancybox}"
               data-type="${item.contentType}"
               data-date="${item['data-date']}"
               data-category="${categoryClass}"
               data-featured="${item.isFeatured}"
               data-caption="
               <div>
               <h4>${item.title}</h4>
               <p>${item.description}</p>
               </div>"
               href="${item.videoSrc}" style="cursor: pointer;">
            <i id="playIcon" class="fa-solid fa-play" style="z-index: 7;"></i>
            <img id="thumbnailImage" 
                 src="${item.imgSrc}" 
                 alt="${item.imgSrcAlt}" 
                 style="z-index: 6; position: absolute; top: 0; left: 0; width: 100%; height: 100%;" />
            <video id="hoverPreview" 
                   loop 
                   muted 
                   src="${item.videoPreview}" 
                   style="z-index: 5; display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            </video>
          </div>`;

      } else if (item.contentType === 'image') {
        const classes = [];
        if (item.itemType === 'Flyer') classes.push('tall');
        const additionalClasses = classes.join(' ');
        html += `
          <div class="mix lc-block image-item fancybox overflow-hidden rounded ${additionalClasses} ${categoryClass}"
               data-fancybox="${item.dataFancybox}"
               data-type="${item.contentType}"
               data-date="${item['data-date']}"
               data-category="${categoryClass}"
               data-featured="${item.isFeatured}"
               data-caption="
               <div>
               <h4>${item.title}</h4>
               <p>${item.description}</p>
               </div>"
               href="${item.imgSrc}" style="cursor: pointer;">
            <i class="fa-solid fa-image" style="z-index: 7;"></i>
            <img id="thumbnailImage" 
                 src="${item.imgSrc}" 
                 alt="${item.imgSrcAlt}"
                 style="width: 100%; height: 100%; object-fit: cover;"/>
          </div>`;

      } else if (item.contentType === 'programming' && (item.itemType === "Website" || item.itemType === "Web Application")) {
        const featuredClass = item.isFeatured ? 'big' : '';
        html += `
    <div class="mix lc-block web-item fancybox mobile-hide overflow-hidden rounded ${featuredClass} ${categoryClass}"
         data-fancybox="${item.dataFancybox}"
         data-type="iframe"
         data-width="100%"
         data-height="100vh"
         data-date="${item['data-date']}"
         data-category="${categoryClass}"
         data-featured="${item.isFeatured}"
         data-caption="
         <div>
         <h4>${item.title}</h4>
         <p>${item.description}</p>
         </div>"
         href="${item.href}" style="cursor: pointer;">
      <i class="fa-solid fa-globe" style="z-index: 7;"></i>
      <img id="thumbnailImage" 
           src="${item.imgSrc}" 
           alt="${item.imgSrcAlt}"
           style="width: 100%; height: 100%; object-fit: cover;" />
    </div>`;
      }
    });
    gridWrapper.innerHTML = html;
  }

  renderCategoryButtons() {
    const desktopMenu = document.querySelector('#category-items-wrapper .category-list');

    if (!desktopMenu) {
      console.error('Category menu container not found');
      return;
    }

    // If tbe accentColor matches any of the ones defined in this object, invert the colors. This is to prevent white text appearing without a black background
    const invertedAccentedColors = {
      '#18181b': '#000',
      '#ebe5c1': '#000'
    };

    this.categories
      .filter(category => !category.isArchived)
      .forEach(category => {
        const hasVideos = this.videos.some(v => v.categoryId === category._id);
        const hasImages = this.images.some(i => i.categoryId === category._id);
        const hasWeb = this.web.some(w => w.categoryId === category._id);
        const categoryLower = category.abbreviatedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');

        if (!hasVideos && !hasImages && !hasWeb && categoryLower !== 'github') {
          return;
        }

        const button = document.createElement('button');
        button.className = 'btn btn-outline-dark d-flex gap-2 align-items-center';
        button.setAttribute('data-filter', `.${categoryLower}`);

        button.style.borderColor = category.accentColor;
        button.style.color = category.accentColor;

        button.onmouseover = () => {
          button.style.backgroundColor = category.accentColor;
          button.style.color = category.primaryColor;
        };

        button.onmouseout = () => {
          if (invertedAccentedColors[category.accentColor]) {
            button.style.backgroundColor = '';
            button.style.color = invertedAccentedColors[category.accentColor];
          } else {
            button.style.backgroundColor = '';
            button.style.color = category.accentColor;
          }
        };

        const iconsSpan = document.createElement('span');
        iconsSpan.className = 'd-flex gap-1';

        if (categoryLower === 'github') {
          iconsSpan.innerHTML = '<i class="fa-brands fa-github"></i>';
          button.onclick = () => window.open('https://github.com/TerryJG', '_blank');
        } else {
          if (hasVideos) {
            iconsSpan.innerHTML += '<i class="fa-solid fa-play"></i>';
          }
          if (hasImages) {
            iconsSpan.innerHTML += '<i class="fa-solid fa-image"></i>';
          }
          if (hasWeb) {
            iconsSpan.innerHTML += '<i class="fa-solid fa-globe"></i>';
          }
        }

        button.appendChild(iconsSpan);
        button.innerHTML += (category.abbreviatedTitle);
        desktopMenu.appendChild(button);
      });
  }

  initializeMixItUp() {
    const container = document.querySelector('.grid-wrapper');
    if (!container) {
      console.error('Container not found for MixItUp initialization');
      return;
    }

    console.log('Initializing MixItUp...');

    try {
      this.mixer = mixitup(container, {
        animation: {
          duration: 250,
          nudge: true,
          reverseOut: false,
          effects: 'fade scale(0.01)'
        },
        load: {
          filter: 'all'
        }
      });

      // Force an update after initialization. This is to prevent a blank grid container
      if (this.mixer) {
        this.mixer.forceRefresh();
        console.log('MixItUp initialized');
      }
    } catch (error) {
      console.error('Error initializing MixItUp:', error);
    }
  }


  initializeNavigation() {
    const navLinks = document.querySelectorAll('header nav .nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const filterValue = link.getAttribute('href').replace('#', '');

        switch (filterValue) {
          case 'video-editing':
            this.mixer.filter('.video-item');
            break;
          case 'graphics-design':
            this.mixer.filter('.image-item');
            break;
          case 'web-development':
            this.mixer.filter('.web-item');
            break;
          case 'all-projects':
            this.mixer.filter('all');
            break;
          default:
            this.mixer.filter('all');
        }
      });
    });

    // Set initial active state
    const defaultLink = document.querySelector('header nav .nav-link[href="#all-projects"]');
    if (defaultLink) {
      defaultLink.classList.add('active');
    }
  }

  initializeEventListeners() {
    // Video preview on hover
    document.querySelectorAll('.video-item').forEach(item => {
      const video = item.querySelector('#hoverPreview');
      if (video) {
        item.addEventListener('mouseenter', () => {
          video.play().catch(err => console.log('Video preview autoplay prevented'));
        });
        item.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });

    // Web preview on hover
    document.querySelectorAll('.web-item').forEach(item => {
      const iframe = item.querySelector('#webPreview');
      const thumbnail = item.querySelector('#thumbnailImage');
      if (iframe && thumbnail) {
        item.addEventListener('mouseenter', () => {
          iframe.style.display = 'block';
          thumbnail.style.opacity = '0';
        });
        item.addEventListener('mouseleave', () => {
          iframe.style.display = 'none';
          thumbnail.style.opacity = '1';
        });
      }
    });

    // Handle mobile menu closure on item click
    document.querySelectorAll('.offcanvas-body .dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const offcanvas = document.querySelector('#offcanvasWithBothOptions');
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      });
    });
  }

  removeErrorMessage() {
    const errorDiv = document.querySelector('.alert-danger');
    if (errorDiv) {
      errorDiv.remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new PortfolioDB();
  portfolio.initialize();
});

export default PortfolioDB;