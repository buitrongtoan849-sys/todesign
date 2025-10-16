// Main initialization - global data and cross-section helpers
document.addEventListener('DOMContentLoaded', function() {
  // Global data exposed via window
  window.passwordResets = [];
  window.renderPasswordResetsTable = function() {}; // Placeholder, defined in password-resets.js

  // Global update functions
  window.updateAuthorSelect = updateAuthorSelectGlobal;
  window.updateCategorySelect = updateCategorySelectGlobal;
  window.updateStorySelect = updateStorySelectGlobal;
  window.updateParentSelect = updateParentSelectGlobal;
  window.updatePostSelect = updatePostSelectGlobal;
  window.updateTagSelect = updateTagSelectGlobal;

  function updateAuthorSelectGlobal() {
    const selects = document.querySelectorAll('#story-author, #post-author');
    selects.forEach(select => {
      if (select) {
        select.innerHTML = '<option value="">-- Chọn author --</option>';
        window.users = window.users || [];
        window.users.filter(u => u.role === 'author').forEach(u => {
          const option = document.createElement('option');
          option.value = u.id;
          option.textContent = `${u.id}: ${u.name}`;
          select.appendChild(option);
        });
      }
    });
  }

  function updateCategorySelectGlobal() {
    const select = document.getElementById('post-category');
    if (select) {
      select.innerHTML = '<option value="">-- Chọn category --</option>';
      window.categories = window.categories || [];
      window.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    }
  }

  function updateStorySelectGlobal() {
    const selects = document.querySelectorAll('#post-story, #chapter-story');
    selects.forEach(select => {
      if (select) {
        select.innerHTML = '<option value="">-- Không có --</option>';
        window.stories = window.stories || [];
        window.stories.forEach(s => {
          const option = document.createElement('option');
          option.value = s.id;
          option.textContent = `${s.id}: ${s.title}`;
          select.appendChild(option);
        });
      }
    });
  }

  function updateParentSelectGlobal() {
    const categoryParentSelect = document.getElementById('category-parent');
    if (categoryParentSelect) {
      categoryParentSelect.innerHTML = '<option value="">-- Không có --</option>';
      window.categories = window.categories || [];
      window.categories.filter(c => c.parent_id === null).forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        categoryParentSelect.appendChild(option);
      });
    }
  }

  function updatePostSelectGlobal() {
    const postSelect = document.getElementById('post-tag-post');
    if (postSelect) {
      postSelect.innerHTML = '';
      window.posts = window.posts || [];
      window.posts.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.id}: ${p.title}`;
        postSelect.appendChild(option);
      });
    }
  }

  function updateTagSelectGlobal() {
    const tagSelect = document.getElementById('post-tag-tag');
    if (tagSelect) {
      tagSelect.innerHTML = '';
      window.tags = window.tags || [];
      window.tags.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = `${t.id}: ${t.name}`;
        tagSelect.appendChild(option);
      });
    }
  }

  // Initial call if needed
  updateAuthorSelectGlobal();
  updateCategorySelectGlobal();
  updateStorySelectGlobal();
});