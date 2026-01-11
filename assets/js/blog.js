/*=============== BLOG POST PAGE FUNCTIONALITY ===============*/
const BLOG_API_BASE = `https://blog.sthamanoj.com.np/wp-json/wp/v2/posts`;
let currentPost = null;

// Get slug from URL parameters
function getSlugFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('slug');
}

// Update meta tags for SEO
function updateMetaTags(post) {
  const title = post.title.rendered;
  const description = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160);
  const image = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url || 'https://sthamanoj.com.np/assets/img/manoj-shrestha.webp';
  const url = window.location.href;
  const author = post._embedded?.author?.[0]?.name || 'Manoj Shrestha';
  const publishedTime = post.date;
  const modifiedTime = post.modified;

  // Update title
  document.title = `${title} | Manoj Shrestha`;
  
  // Update meta tags
  document.querySelector('meta[name="title"]').setAttribute('content', title);
  document.querySelector('meta[name="description"]').setAttribute('content', description);
  
  // Update Open Graph tags
  document.querySelector('meta[property="og:title"]').setAttribute('content', title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', description);
  document.querySelector('meta[property="og:image"]').setAttribute('content', image);
  document.querySelector('meta[property="og:url"]').setAttribute('content', url);
  document.querySelector('meta[property="article:author"]').setAttribute('content', author);
  document.querySelector('meta[property="article:published_time"]').setAttribute('content', publishedTime);
  document.querySelector('meta[property="article:modified_time"]').setAttribute('content', modifiedTime);
  
  // Update Twitter Card tags
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', description);
  document.querySelector('meta[name="twitter:image"]').setAttribute('content', image);
  
  // Update canonical URL
  document.querySelector('link[rel="canonical"]').setAttribute('href', url);
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Render blog post
function renderBlogPost(post) {
  currentPost = post;
  
  // Update meta tags
  updateMetaTags(post);
  
  // Update breadcrumb
  document.getElementById('breadcrumb-title').textContent = post.title.rendered;
  
  // Update featured image
  const featuredImage = document.getElementById('blog-featured-image');
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    featuredImage.src = post._embedded['wp:featuredmedia'][0].source_url;
    featuredImage.alt = post.title.rendered;
  } else {
    featuredImage.style.display = 'none';
  }
  
  // Update title
  document.getElementById('blog-title').textContent = post.title.rendered;
  
  // Update meta information
  document.getElementById('blog-author').textContent = post._embedded?.author?.[0]?.name || 'Admin';
  document.getElementById('blog-date').textContent = formatDate(post.date);
  
  // Calculate and update read time
  const readTime = calculateReadTime(post.content.rendered);
  document.getElementById('blog-read-time').textContent = `${readTime} min read`;
  
  // Update content
  document.getElementById('blog-body').innerHTML = post.content.rendered;
  
  // Setup social sharing
  setupSocialSharing(post);
  
  // Show content
  document.getElementById('blog-loading').style.display = 'none';
  document.getElementById('blog-content').style.display = 'block';
  
  // Animate content with ScrollReveal
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.blog-post__content > *', {
      origin: 'bottom',
      distance: '30px',
      duration: 800,
      interval: 100,
      reset: false
    });
  }
}

// Setup social sharing
function setupSocialSharing(post) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(post.title.rendered);
  const description = encodeURIComponent(post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 100));
  
  // Facebook
  document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  
  // Twitter
  document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  
  // LinkedIn
  document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  
  // WhatsApp
  document.getElementById('share-whatsapp').href = `https://wa.me/?text=${title}%20${url}`;
  
  // Add click handlers for analytics (optional)
  document.querySelectorAll('.blog-share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // You can add analytics tracking here
      console.log('Share clicked:', e.target.closest('.blog-share-btn').id);
    });
  });
}

// Fetch blog post by slug
async function fetchBlogPost(slug) {
  try {
    const response = await fetch(
      `${BLOG_API_BASE}?slug=${encodeURIComponent(slug)}&_embed`,
      {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:ed25 esqw UNYW ezUN vtWX WQ1M')
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    
    const posts = await response.json();
    
    if (posts.length === 0) {
      throw new Error('Post not found');
    }
    
    const post = posts[0];
    renderBlogPost(post);
    
  } catch (error) {
    console.error('Error fetching blog post:', error);
    showError();
  }
}

// Show error state
function showError() {
  document.getElementById('blog-loading').style.display = 'none';
  document.getElementById('blog-error').style.display = 'block';
}

// Initialize blog post page
function initBlogPost() {
  const slug = getSlugFromURL();
  
  if (!slug) {
    showError();
    return;
  }
  
  // Fetch the blog post
  fetchBlogPost(slug);
}

// Add structured data for SEO
function addStructuredData(post) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title.rendered,
    "description": post.excerpt.rendered.replace(/<[^>]+>/g, ''),
    "image": post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url || 'https://sthamanoj.com.np/assets/img/manoj-shrestha.webp',
    "author": {
      "@type": "Person",
      "name": post._embedded?.author?.[0]?.name || "Manoj Shrestha"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Manoj Shrestha",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sthamanoj.com.np/assets/img/manoj-shrestha.webp"
      }
    },
    "datePublished": post.date,
    "dateModified": post.modified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };
  
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBlogPost);

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const slug = getSlugFromURL();
  if (slug) {
    fetchBlogPost(slug);
  }
}); 