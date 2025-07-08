/*=============== CATEGORIES PAGE FUNCTIONALITY ===============*/
const CATEGORIES_API_BASE = `https://wordpress-inuw7.wasmer.app/wp-json/wp/v2/categories`;
const POSTS_API_BASE = `https://wordpress-inuw7.wasmer.app/wp-json/wp/v2/posts`;

// Category icons mapping
const categoryIcons = {
  'garena-freefire': 'bx-game',
  'pubg': 'bx-game',
  'elite': 'bx-crown',
  'membership': 'bx-user-check',
  'skins': 'bx-palette',
  'uc': 'bx-coin',
  'default': 'bx-category'
};

// Initialize categories page
async function initCategories() {
  try {
    const categories = await fetchCategories();
    const posts = await fetchPosts();
    
    // Group posts by category
    const postsByCategory = groupPostsByCategory(posts);
    
    // Render categories with post counts
    renderCategories(categories, postsByCategory);
    
  } catch (error) {
    console.error('Error initializing categories:', error);
    showCategoriesError();
  }
}

// Fetch categories from WordPress API
async function fetchCategories() {
  const response = await fetch(`${CATEGORIES_API_BASE}?per_page=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return await response.json();
}

// Fetch posts to count them per category
async function fetchPosts() {
  const response = await fetch(`${POSTS_API_BASE}?per_page=100&_embed`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
}

// Group posts by category
function groupPostsByCategory(posts) {
  const postsByCategory = {};
  
  posts.forEach(post => {
    if (post.categories && post.categories.length > 0) {
      post.categories.forEach(categoryId => {
        if (!postsByCategory[categoryId]) {
          postsByCategory[categoryId] = [];
        }
        postsByCategory[categoryId].push(post);
      });
    }
  });
  
  return postsByCategory;
}

// Get category icon
function getCategoryIcon(category) {
  const slug = category.slug.toLowerCase();
  return categoryIcons[slug] || categoryIcons.default;
}

// Render categories
function renderCategories(categories, postsByCategory) {
  const categoriesContainer = document.getElementById('categories-content');
  
  if (categories.length === 0) {
    showCategoriesError();
    return;
  }
  
  const categoriesHTML = categories.map(category => {
    const postCount = postsByCategory[category.id]?.length || 0;
    const icon = getCategoryIcon(category);
    
    return `
      <div class="category-card" onclick="navigateToCategory('${category.slug}')">
        <div class="category-card__icon">
          <i class='bx ${icon}'></i>
        </div>
        <h3 class="category-card__title">${category.name}</h3>
        <p class="category-card__description">${category.description || 'Explore posts in this category'}</p>
        <div class="category-card__meta">
          <div class="category-card__count">
            <i class='bx bx-file'></i>
            <span>${postCount} posts</span>
          </div>
          <i class='bx bx-right-arrow-alt category-card__arrow'></i>
        </div>
      </div>
    `;
  }).join('');
  
  categoriesContainer.innerHTML = categoriesHTML;
  
  // Hide loading and show content
  document.getElementById('categories-loading').style.display = 'none';
  categoriesContainer.style.display = 'grid';
  
  // Animate categories with ScrollReveal
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.category-card', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      interval: 120,
      reset: false
    });
  }
}

// Navigate to category page
function navigateToCategory(categorySlug) {
  window.location.href = `category.html?slug=${encodeURIComponent(categorySlug)}`;
}

// Show error state
function showCategoriesError() {
  document.getElementById('categories-loading').style.display = 'none';
  document.getElementById('categories-error').style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCategories); 