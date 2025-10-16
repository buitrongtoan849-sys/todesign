let tags = [
  { id: 1, name: 'Công nghệ', slug: 'cong-nghe', created_at: new Date().toISOString() },
  { id: 2, name: 'Giải trí', slug: 'giai-tri', created_at: new Date().toISOString() },
  { id: 3, name: 'Lập trình', slug: 'lap-trinh', created_at: new Date().toISOString() }
];
let posts = [
  { id: 1, title: 'Bài viết về công nghệ mới' },
  { id: 2, title: 'Hướng dẫn lập trình Python' },
  { id: 3, title: 'Review phim hay nhất 2023' }
];
let postTags = [
  { post_id: 1, tag_id: 1 },
  { post_id: 2, tag_id: 3 },
  { post_id: 3, tag_id: 2 }
];
let currentTagId = null;

window.tags = tags;
window.posts = posts; // For post-tags
window.postTags = postTags;

function initTags() {
  const saveTagBtn = document.getElementById('save-tag');
  if (saveTagBtn) saveTagBtn.onclick = saveTag;
  const nameInput = document.getElementById('tag-name');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      const slugInput = document.getElementById('tag-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }
  const savePostTagBtn = document.getElementById('save-post-tag');
  if (savePostTagBtn) savePostTagBtn.onclick = savePostTag;
  window.updatePostSelect();
  window.updateTagSelect();
  renderTagTable();
  renderPostTagTable();
}

function renderTagTable() {
  const tagTable = document.getElementById('tag-table');
  if (!tagTable) return;
  tagTable.innerHTML = '';
  tags.forEach(t => {
    const row = document.createElement('tr');
    const createdDate = new Date(t.created_at).toLocaleDateString('vi-VN');
    row.innerHTML = `
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.slug}</td>
      <td>${createdDate}</td>
      <td>
        <button class="btn-small" onclick="editTag(${t.id})">Sửa</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteTag(${t.id})">Xóa</button>
      </td>`;
    tagTable.appendChild(row);
  });
}

function showTagForm() {
  document.getElementById('tag-form').style.display = 'block';
  document.getElementById('tag-form-title').innerText = 'Thêm tag';
  currentTagId = null;
  document.getElementById('tag-id').value = '';
  document.getElementById('tag-name').value = '';
  document.getElementById('tag-slug').value = '';
}

function saveTag() {
  const name = document.getElementById('tag-name').value.trim();
  const slug = document.getElementById('tag-slug').value.trim();

  if (!name || !slug) return alert('Vui lòng nhập tên và slug.');

  const slugExisting = tags.find(tag => tag.slug === slug && (!currentTagId || tag.id !== currentTagId));
  const nameExisting = tags.find(tag => tag.name === name && (!currentTagId || tag.id !== currentTagId));
  if (slugExisting) return alert('Slug đã tồn tại!');
  if (nameExisting) return alert('Tên đã tồn tại!');

  const now = new Date().toISOString();
  if (currentTagId) {
    const tag = tags.find(x => x.id === currentTagId);
    if (tag) {
      Object.assign(tag, { name, slug });
      alert('Cập nhật tag thành công!');
    }
  } else {
    tags.push({ id: tags.length + 1, name, slug, created_at: now });
    alert('Thêm tag thành công!');
  }
  renderTagTable();
  renderPostTagTable();
  window.updateTagSelect();
  document.getElementById('tag-form').style.display = 'none';
}

function editTag(id) {
  const tag = tags.find(x => x.id === id);
  if (!tag) return;
  document.getElementById('tag-form').style.display = 'block';
  document.getElementById('tag-form-title').innerText = 'Chỉnh sửa tag';
  document.getElementById('tag-id').value = tag.id;
  document.getElementById('tag-name').value = tag.name;
  document.getElementById('tag-slug').value = tag.slug;
  currentTagId = tag.id;
}

function deleteTag(id) {
  if (confirm(`Xóa tag ID ${id}?`)) {
    const isUsed = postTags.some(pt => pt.tag_id === id);
    if (isUsed) return alert('Không thể xóa tag đang được sử dụng trong post-tags!');
    tags = tags.filter(t => t.id !== id);
    alert('Xóa tag thành công!');
    renderTagTable();
    renderPostTagTable();
    window.updateTagSelect();
  }
}

function showPostTagForm() {
  window.updatePostSelect();
  window.updateTagSelect();
  document.getElementById('post-tag-form').style.display = 'block';
  document.getElementById('post-tag-form-title').innerText = 'Thêm liên kết Post-Tag';
  document.getElementById('post-tag-post').value = '';
  document.getElementById('post-tag-tag').value = '';
}

function savePostTag() {
  const postId = parseInt(document.getElementById('post-tag-post').value);
  const tagId = parseInt(document.getElementById('post-tag-tag').value);
  if (!postId || !tagId) return alert('Vui lòng chọn post và tag.');

  const existing = postTags.find(pt => pt.post_id === postId && pt.tag_id === tagId);
  if (existing) return alert('Liên kết này đã tồn tại!');

  postTags.push({ post_id: postId, tag_id: tagId });
  alert('Thêm liên kết thành công!');
  renderPostTagTable();
  document.getElementById('post-tag-form').style.display = 'none';
}

function renderPostTagTable() {
  const postTagTable = document.getElementById('post-tag-table');
  if (!postTagTable) return;
  postTagTable.innerHTML = '';
  postTags.forEach(pt => {
    const post = posts.find(p => p.id === pt.post_id);
    const tag = tags.find(t => t.id === pt.tag_id);
    if (!post || !tag) return;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pt.post_id}</td>
      <td>${post.title}</td>
      <td>${pt.tag_id}</td>
      <td>${tag.name}</td>
      <td>
        <button class="btn-small" style="background: #ef4444;" onclick="deletePostTag(${pt.post_id}, ${pt.tag_id})">Xóa</button>
      </td>`;
    postTagTable.appendChild(row);
  });
}

function deletePostTag(postId, tagId) {
  if (confirm(`Xóa liên kết Post ${postId} - Tag ${tagId}?`)) {
    postTags = postTags.filter(pt => !(pt.post_id === postId && pt.tag_id === tagId));
    alert('Xóa liên kết thành công!');
    renderPostTagTable();
  }
}

window.initTags = initTags;