// Metatag config
const metaTags = {
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
  favicon: {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico'
  },
  openGraph: {
    title: 'Terrance Gibson | Digital Portfolio',
    description: 'Resume | Terrance Gibson, +1 (242) 807-1983, gibson.terrance.bs@gmail.com',
    image: 'content/icons/link_thumbnail.jpg',
    imageType: 'image/jpeg',
    url: 'https://madebyterrance.pages.dev/',
    themeColor: '#212529'
  }
};

// Page title config
const pageTitles = {
  'index.html': 'Home - Terrance Gibson',
  'projects.html': 'Projects - Terrance Gibson',
  'credits.html': 'Credits - Terrance Gibson'
};

function loadScript(src, { integrity = null, crossorigin = null } = {}) {
  return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      
      // Only set integrity if provided and in production
      if (integrity && process.env.NODE_ENV === 'production') {
          script.integrity = integrity;
      }
      if (crossorigin) {
          script.crossorigin = crossorigin;
      }
      
      script.onload = () => resolve(script);
      script.onerror = (error) => {
          console.warn(`Warning: Script loading error for ${src}`, error);
          if (process.env.NODE_ENV !== 'production') { // In development, resolve anyway to prevent breaking
              resolve(script);
          } else {
              reject(error);
          }
      };
      document.head.appendChild(script);
  });
}

// Setup head elements
function setupHead() {
  const head = document.head;

  // Set charset and viewport
  const charsetMeta = document.createElement('meta');
  charsetMeta.charset = metaTags.charset;
  head.appendChild(charsetMeta);

  const viewportMeta = document.createElement('meta');
  viewportMeta.setAttribute('name', 'viewport');
  viewportMeta.setAttribute('content', metaTags.viewport);
  head.appendChild(viewportMeta);

  // Set page title
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const title = document.createElement('title');
  title.textContent = pageTitles[currentPage] || 'Digital Portfolio';
  head.appendChild(title);

  // Set favicon
  const favicon = document.createElement('link');
  favicon.rel = metaTags.favicon.rel;
  favicon.type = metaTags.favicon.type;
  favicon.href = metaTags.favicon.href;
  head.appendChild(favicon);
}
// Main setup function
async function setupHeader() {
  try {
    setupHead();

    const event = new Event('headerSetupComplete');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error during header setup:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupHeader);
} else {
  setupHeader();
}