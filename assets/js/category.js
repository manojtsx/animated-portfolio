/*=============== CATEGORY PAGE FUNCTIONALITY ===============*/
const CATEGORY_API_BASE = `https://blog.sthamanoj.com.npp/wp-json/wp/v2/posts`;
const CATEGORIES_API_BASE = `https://blog.sthamanoj.com.np/wp-json/wp/v2/categories`;
let categoryPosts = [];
let currentCategory = null;
let currentPage = 1;
const POSTS_PER_PAGE = 10;

// Get category slug from URL parameters
function getCategorySlugFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('slug');
}

// Update meta tags for SEO
function updateCategoryMetaTags(category) {
  const title = `${category.name} - Blog Posts | Manoj Shrestha`;
  const description = category.description || `Browse all blog posts in ${category.name} category.`;
  const url = window.location.href;

  // Update title
  document.title = title;
  
  // Update meta tags
  document.querySelector('meta[name="title"]').setAttribute('content', title);
  document.querySelector('meta[name="description"]').setAttribute('content', description);
  
  // Update Open Graph tags
  document.querySelector('meta[property="og:title"]').setAttribute('content', title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', description);
  document.querySelector('meta[property="og:url"]').setAttribute('content', url);
  
  // Update Twitter Card tags
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', description);
  
  // Update canonical URL
  document.querySelector('link[rel="canonical"]').setAttribute('href', url);
}

// Fetch category information
async function fetchCategoryInfo(categorySlug) {
  try {
    const response = await fetch(`${CATEGORIES_API_BASE}?slug=${encodeURIComponent(categorySlug)}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    
    const categories = await response.json();
    if (categories.length === 0) throw new Error('Category not found');
    
    return categories[0];
  } catch (error) {
    console.error('Error fetching category info:', error);
    return null;
  }
}

// Fetch posts by category
async function fetchCategoryPosts(categoryId) {
  try {
    const response = await fetch(`${CATEGORY_API_BASE}?categories=${categoryId}&per_page=100&_embed`);
    if (!response.ok) throw new Error('Failed to fetch category posts');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

// Render all posts in a single grid
function renderCategoryGrid() {
  const posts = categoryPosts;
  const categoryContent = document.getElementById('category-content');
  const pagination = document.getElementById('category-pagination');
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const endIdx = startIdx + POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIdx, endIdx);

  if (posts.length === 0) {
    categoryContent.innerHTML = `
      <div class="blog-empty">
        <i class='bx bx-news'></i>
        <h3>No Posts Found</h3>
        <p>No posts found in this category yet.</p>
      </div>
    `;
    if (pagination) pagination.innerHTML = '';
  } else {
    categoryContent.innerHTML = pagePosts.map(post => {
      const img = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url
        ? `<img class="blog__image" src="${post._embedded['wp:featuredmedia'][0].source_url}" alt="${post.title.rendered}" loading="lazy">`
        : '';
      const date = new Date(post.date).toLocaleDateString();
      const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
      return `
        <div class="blog__card">
          ${img}
          <div class="blog__content">
            <div class="blog__meta">${date} | ${post._embedded?.author?.[0]?.name || 'Admin'}</div>
            <h3 class="blog__title">${post.title.rendered}</h3>
            <div class="blog__excerpt">${excerpt}</div>
            <a class="blog__readmore" href="blog.html?slug=${encodeURIComponent(post.slug)}">Read More</a>
          </div>
        </div>
      `;
    }).join('');
    renderPagination(totalPages);
  }
  // Animate blog cards
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.blog__card', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      interval: 120,
      reset: false
    });
  }
}

function renderPagination(totalPages) {
  let pagination = document.getElementById('category-pagination');
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'category-pagination';
    pagination.className = 'categories__pagination';
    document.getElementById('category-content').after(pagination);
  }
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  let html = '';
  if (currentPage > 1) {
    html += `<button class="categories__page-btn" data-page="${currentPage - 1}">Prev</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="categories__page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button class="categories__page-btn" data-page="${currentPage + 1}">Next</button>`;
  }
  pagination.innerHTML = html;
  // Add event listeners
  Array.from(pagination.querySelectorAll('.categories__page-btn')).forEach(btn => {
    btn.onclick = (e) => {
      const page = parseInt(btn.getAttribute('data-page'));
      if (!isNaN(page) && page !== currentPage) {
        currentPage = page;
        renderCategoryGrid();
        window.scrollTo({ top: document.getElementById('category-content').offsetTop - 80, behavior: 'smooth' });
      }
    };
  });
}

// Initialize category page
async function initCategoryPage() {
  const categorySlug = getCategorySlugFromURL();
  
  if (!categorySlug) {
    showCategoryError();
    return;
  }
  
  try {
    // Fetch category info
    const category = await fetchCategoryInfo(categorySlug);
    if (!category) {
      showCategoryError();
      return;
    }
    
    currentCategory = category;
    
    // Update page content
    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-description').textContent = category.description || `Browse all posts in ${category.name} category.`;
    document.getElementById('breadcrumb-category').textContent = category.name;
    
    // Update meta tags
    updateCategoryMetaTags(category);
    
    // Fetch posts for this category
    categoryPosts = await fetchCategoryPosts(category.id);
    
    // Render all posts in grid
    renderCategoryGrid();
    
    // Hide loading and show content
    document.getElementById('category-loading').style.display = 'none';
    document.getElementById('category-content').style.display = 'grid';
    // Hide pagination if present
    const pagination = document.getElementById('category-pagination');
    if (pagination) pagination.style.display = 'none';
    
  } catch (error) {
    console.error('Error initializing category page:', error);
    showCategoryError();
  }
}

// Show error state
function showCategoryError() {
  document.getElementById('category-loading').style.display = 'none';
  document.getElementById('category-error').style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCategoryPage);

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const categorySlug = getCategorySlugFromURL();
  if (categorySlug) {
    initCategoryPage();
  }
}); 