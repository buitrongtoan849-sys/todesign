let stories = [
  { id: 1, title: 'Truyện Kiếm Hiệp Hay', slug: 'truyen-kiem-hiep-hay', description: 'Một câu chuyện kiếm hiệp hấp dẫn.', cover_url: '', author_id: 2, status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, title: 'Huyền Thoại Hiện Đại', slug: 'huyen-thoai-hien-dai', description: 'Câu chuyện fantasy hiện đại.', cover_url: '', author_id: 3, status: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let currentStoryId = null;
let storyCoverURL = '';

window.stories = stories;
window.users = window.users || [];

function initStories() {
  const coverInput = document.getElementById('story-cover');
  const coverPreview = document.getElementById('cover-preview');
  if (coverInput && coverPreview) {
    coverInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          storyCoverURL = reader.result;
          coverPreview.innerHTML = `<img src="${storyCoverURL}">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  const saveBtn = document.getElementById('save-story');
  if (saveBtn) saveBtn.onclick = saveStory;
  const titleInput = document.getElementById('story-title');
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      const slugInput = document.getElementById('story-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }
  window.updateAuthorSelect();
  window.updateStorySelect();
  renderStoriesTable();
}

function renderStoriesTable() {
  const storiesTable = document.getElementById('stories-table');
  if (!storiesTable) return;
  storiesTable.innerHTML = '';
  stories.forEach(s => {
    const row = document.createElement('tr');
    const authorName = window.users.find(u => u.id === s.author_id)?.name || 'Unknown';
    const statusBadge = `<span class="status-badge status-${s.status}">${s.status}</span>`;
    const coverCell = s.cover_url ? `<img src="${s.cover_url}" width="60" height="40" style="object-fit:cover;">` : 'No Cover';
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.title}</td>
      <td>${s.slug}</td>
      <td>${s.description.substring(0, 30)}...</td>
      <td>${authorName}</td>
      <td>${statusBadge}</td>
      <td>${coverCell}</td>
      <td>
        <button class="btn-small" onclick="editStory(${s.id})">Sửa</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteStory(${s.id})">Xóa</button>
      </td>`;
    storiesTable.appendChild(row);
  });
}

function showStoryForm() {
  window.updateAuthorSelect();
  window.updateStorySelect();
  document.getElementById('story-form').style.display = 'block';
  document.getElementById('story-form-title').innerText = 'Thêm truyện mới';
  currentStoryId = null;
  document.getElementById('story-id').value = '';
  document.getElementById('story-title').value = '';
  document.getElementById('story-slug').value = '';
  document.getElementById('story-description').value = '';
  document.getElementById('story-author').value = '';
  document.getElementById('story-status').value = 'draft';
  const coverPreview = document.getElementById('cover-preview');
  if (coverPreview) coverPreview.innerHTML = 'No Image';
  document.getElementById('story-cover').value = '';
  storyCoverURL = '';
}

function saveStory() {
  const title = document.getElementById('story-title').value.trim();
  const slug = document.getElementById('story-slug').value.trim();
  const description = document.getElementById('story-description').value.trim();
  const authorId = parseInt(document.getElementById('story-author').value);
  const status = document.getElementById('story-status').value;

  if (!title || !slug || !authorId) return alert('Vui lòng nhập đầy đủ thông tin.');

  const slugExisting = stories.find(st => st.slug === slug && (!currentStoryId || st.id !== currentStoryId));
  if (slugExisting) return alert('Slug đã tồn tại!');

  const now = new Date().toISOString();
  if (currentStoryId) {
    const story = stories.find(x => x.id === currentStoryId);
    if (story) {
      Object.assign(story, { title, slug, description, author_id: authorId, status, cover_url: storyCoverURL, updated_at: now });
      alert('Cập nhật truyện thành công!');
    }
  } else {
    stories.push({ id: stories.length + 1, title, slug, description, cover_url: storyCoverURL, author_id: authorId, status, created_at: now, updated_at: now });
    alert('Thêm truyện thành công!');
  }
  renderStoriesTable();
  window.updateStorySelect();
  document.getElementById('story-form').style.display = 'none';
}

function editStory(id) {
  const story = stories.find(x => x.id === id);
  if (!story) return;
  window.updateAuthorSelect();
  document.getElementById('story-form').style.display = 'block';
  document.getElementById('story-form-title').innerText = 'Chỉnh sửa truyện';
  document.getElementById('story-id').value = story.id;
  document.getElementById('story-title').value = story.title;
  document.getElementById('story-slug').value = story.slug;
  document.getElementById('story-description').value = story.description;
  document.getElementById('story-author').value = story.author_id;
  document.getElementById('story-status').value = story.status;
  const coverPreview = document.getElementById('cover-preview');
  if (coverPreview) coverPreview.innerHTML = story.cover_url ? `<img src="${story.cover_url}">` : 'No Image';
  storyCoverURL = story.cover_url || '';
  currentStoryId = story.id;
}

function deleteStory(id) {
  if (confirm(`Xóa truyện ID ${id}?`)) {
    // Check if has chapters
    window.chapters = window.chapters || [];
    const hasChapters = window.chapters.some(ch => ch.story_id === id);
    if (hasChapters) return alert('Không thể xóa truyện có chương!');
    stories = stories.filter(s => s.id !== id);
    alert('Xóa thành công!');
    renderStoriesTable();
    window.updateStorySelect();
  }
}

window.initStories = initStories;