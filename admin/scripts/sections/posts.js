let fullPosts = [
  { id: 1, title: 'Bài viết về công nghệ mới', slug: 'bai-viet-cong-nghe-moi', content: '<p>Nội dung bài viết...</p><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Alt4XvG4hM1g5Kk5R0XU4iY2v//Z" alt="Hình ảnh công nghệ" style="max-width:100%; height:auto; display:block; margin:10px 0;">', youtube_url: '', thumbnail_url: '', author_id: 2, category_id: 1, story_id: null, status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let currentPostId = null;
let postThumbnailURL = '';

window.fullPosts = fullPosts;
window.posts = fullPosts.map(p => ({ id: p.id, title: p.title })); // For tags
window.categories = window.categories || [];
window.stories = window.stories || [];
window.users = window.users || [];

function initPosts() {
  const thumbnailInput = document.getElementById('post-thumbnail');
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  if (thumbnailInput && thumbnailPreview) {
    thumbnailInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          postThumbnailURL = reader.result;
          thumbnailPreview.innerHTML = `<img src="${postThumbnailURL}">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  const saveBtn = document.getElementById('save-post');
  if (saveBtn) saveBtn.onclick = savePost;
  const titleInput = document.getElementById('post-title');
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      const slugInput = document.getElementById('post-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }
  window.updateAuthorSelect();
  window.updateCategorySelect();
  window.updateStorySelect();
  renderPostsTable();
  window.updatePostSelect(); // For tags
}

function renderPostsTable() {
  const postsTable = document.getElementById('posts-table');
  if (!postsTable) return;
  postsTable.innerHTML = '';
  fullPosts.forEach(p => {
    const row = document.createElement('tr');
    const categoryName = window.categories.find(c => c.id === p.category_id)?.name || 'Uncategorized';
    const storyTitle = p.story_id ? window.stories.find(s => s.id === p.story_id)?.title || 'Unknown' : '';
    const authorName = window.users.find(u => u.id === p.author_id)?.name || 'Unknown';
    const statusBadge = `<span class="status-badge status-${p.status}">${p.status}</span>`;
    const thumbCell = p.thumbnail_url ? `<img src="${p.thumbnail_url}" width="60" height="40" style="object-fit:cover;">` : 'No Thumb';
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.slug}</td>
      <td>${categoryName}</td>
      <td>${p.story_id || ''} (${storyTitle})</td>
      <td>${authorName}</td>
      <td>${statusBadge}</td>
      <td>${thumbCell}</td>
      <td>
        <button class="btn-small" onclick="editPost(${p.id})">Sửa</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deletePost(${p.id})">Xóa</button>
      </td>`;
    postsTable.appendChild(row);
  });
}

function showPostForm() {
  window.updateAuthorSelect();
  window.updateCategorySelect();
  window.updateStorySelect();
  const editorContainer = document.getElementById('post-editor-container');
  if (editorContainer) editorContainer.innerHTML = '';
  initEditor('post-editor-container');
  document.getElementById('post-form').style.display = 'block';
  document.getElementById('post-form-title').innerText = 'Thêm bài viết mới';
  currentPostId = null;
  document.getElementById('post-id').value = '';
  document.getElementById('post-title').value = '';
  document.getElementById('post-slug').value = '';
  document.getElementById('post-content').value = '';
  document.getElementById('post-youtube').value = '';
  document.getElementById('post-author').value = '';
  document.getElementById('post-category').value = '';
  document.getElementById('post-story').value = '';
  document.getElementById('post-status').value = 'draft';
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  if (thumbnailPreview) thumbnailPreview.innerHTML = 'No Image';
  document.getElementById('post-thumbnail').value = '';
  postThumbnailURL = '';
}

function savePost() {
  const title = document.getElementById('post-title').value.trim();
  const slug = document.getElementById('post-slug').value.trim();
  const content = getEditorContent('post-editor-container');
  const youtube_url = document.getElementById('post-youtube').value.trim();
  const authorId = parseInt(document.getElementById('post-author').value);
  const categoryId = parseInt(document.getElementById('post-category').value);
  const storyId = parseInt(document.getElementById('post-story').value) || null;
  const status = document.getElementById('post-status').value;

  if (!title || !slug || !authorId || !categoryId) return alert('Vui lòng nhập đầy đủ thông tin bắt buộc.');

  const slugExisting = fullPosts.find(po => po.slug === slug && (!currentPostId || po.id !== currentPostId));
  if (slugExisting) return alert('Slug đã tồn tại!');

  const now = new Date().toISOString();
  if (currentPostId) {
    const post = fullPosts.find(x => x.id === currentPostId);
    if (post) {
      Object.assign(post, { title, slug, content, youtube_url, thumbnail_url: postThumbnailURL, author_id: authorId, category_id: categoryId, story_id: storyId, status, updated_at: now });
      alert('Cập nhật bài viết thành công!');
    }
  } else {
    fullPosts.push({ id: fullPosts.length + 1, title, slug, content, youtube_url, thumbnail_url: postThumbnailURL, author_id: authorId, category_id: categoryId, story_id: storyId, status, created_at: now, updated_at: now });
    alert('Thêm bài viết thành công!');
  }
  renderPostsTable();
  window.renderPostTagTable = window.renderPostTagTable || function(){}; // If defined in tags
  if (window.renderPostTagTable) window.renderPostTagTable();
  document.getElementById('post-form').style.display = 'none';
}

function editPost(id) {
  const post = fullPosts.find(x => x.id === id);
  if (!post) return;
  window.updateAuthorSelect();
  window.updateCategorySelect();
  window.updateStorySelect();
  const editorContainer = document.getElementById('post-editor-container');
  if (editorContainer) editorContainer.innerHTML = '';
  initEditor('post-editor-container', post.content);
  document.getElementById('post-form').style.display = 'block';
  document.getElementById('post-form-title').innerText = 'Chỉnh sửa bài viết';
  document.getElementById('post-id').value = post.id;
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-slug').value = post.slug;
  document.getElementById('post-content').value = post.content;
  document.getElementById('post-youtube').value = post.youtube_url;
  document.getElementById('post-author').value = post.author_id;
  document.getElementById('post-category').value = post.category_id;
  document.getElementById('post-story').value = post.story_id || '';
  document.getElementById('post-status').value = post.status;
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  if (thumbnailPreview) thumbnailPreview.innerHTML = post.thumbnail_url ? `<img src="${post.thumbnail_url}">` : 'No Image';
  postThumbnailURL = post.thumbnail_url || '';
  currentPostId = post.id;
}

function deletePost(id) {
  if (confirm(`Xóa bài viết ID ${id}?`)) {
    window.comments = window.comments || [];
    const hasComments = window.comments.some(com => com.post_id === id);
    if (hasComments) return alert('Không thể xóa bài viết có bình luận!');
    fullPosts = fullPosts.filter(p => p.id !== id);
    window.postTags = window.postTags || [];
    window.postTags = window.postTags.filter(pt => pt.post_id !== id);
    alert('Xóa thành công!');
    renderPostsTable();
    if (window.renderPostTagTable) window.renderPostTagTable();
  }
}

window.initPosts = initPosts;