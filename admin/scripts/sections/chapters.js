// ================================
// 📘 CHAPTERS.JS — Quản lý chương truyện
// ================================

let chapters = [
  {
    id: 1,
    story_id: 1,
    title: 'Chương 1: Khởi đầu',
    slug: 'chuong-1-khoi-dau',
    content:
      '<p>Nội dung chương 1 với hình ảnh...</p><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." alt="Hình ảnh chương 1" style="max-width:100%; height:auto; display:block; margin:10px 0;">',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    story_id: 1,
    title: 'Chương 2: Cuộc phiêu lưu',
    slug: 'chuong-2-cuoc-phieu-luu',
    content: '<p>Nội dung chương 2...</p>',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let currentChapterId = null;

// Dữ liệu stories toàn cục (giả lập)
window.stories = window.stories || [];

// ================================
// 🚀 Khởi tạo
// ================================
function initChapters() {
  const saveBtn = document.getElementById('save-chapter');
  if (saveBtn) saveBtn.onclick = saveChapter;

  const titleInput = document.getElementById('chapter-title');
  if (titleInput) {
    titleInput.addEventListener('input', function () {
      const slugInput = document.getElementById('chapter-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }

  window.updateStorySelect();
  renderChaptersTable();
}

// ================================
// 📄 Hiển thị danh sách chương
// ================================
function renderChaptersTable() {
  const chaptersTable = document.getElementById('chapters-table');
  if (!chaptersTable) return;

  chaptersTable.innerHTML = '';

  // Bỏ toàn bộ thẻ HTML, chỉ lấy text
  const stripHTML = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  // Escape ký tự đặc biệt (HTML-safe)
  const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m]));

  chapters.forEach((ch) => {
    const row = document.createElement('tr');

    const storyTitle = window.stories.find((s) => s.id === ch.story_id)?.title || 'Unknown';

    const plainText = stripHTML(ch.content);
    const contentPreview = escapeHTML(plainText.substring(0, 80)) + (plainText.length > 80 ? '...' : '');

    row.innerHTML = `
      <td>${ch.id}</td>
      <td>${ch.story_id} (${escapeHTML(storyTitle)})</td>
      <td>${escapeHTML(ch.title)}</td>
      <td>${escapeHTML(ch.slug)}</td>
      <td>${ch.order_index}</td>
      <td>${contentPreview}</td>
      <td style="white-space: nowrap;">
        <button class="btn-small" onclick="editChapter(${ch.id})">Sửa</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteChapter(${ch.id})">Xóa</button>
      </td>
    `;

    chaptersTable.appendChild(row);
  });
}

// ================================
// 📝 Hiển thị form thêm mới
// ================================
function showChapterForm() {
  window.updateStorySelect();
  const editorContainer = document.getElementById('chapter-editor-container');
  if (editorContainer) editorContainer.innerHTML = '';
  initEditor('chapter-editor-container');
  document.getElementById('chapter-form').style.display = 'block';
  document.getElementById('chapter-form-title').innerText = 'Thêm chương mới';

  currentChapterId = null;

  document.getElementById('chapter-id').value = '';
  document.getElementById('chapter-story').value = '';
  document.getElementById('chapter-title').value = '';
  document.getElementById('chapter-slug').value = '';
  document.getElementById('chapter-content').value = '';
  document.getElementById('chapter-order').value = '';
}

// ================================
// 💾 Lưu chương (thêm mới / cập nhật)
// ================================
function saveChapter() {
  const storyId = parseInt(document.getElementById('chapter-story').value);
  const title = document.getElementById('chapter-title').value.trim();
  const slug = document.getElementById('chapter-slug').value.trim();
  const content = getEditorContent('chapter-editor-container');
  const orderIndex = parseInt(document.getElementById('chapter-order').value);

  if (!storyId || !title || !slug || !orderIndex)
    return alert('Vui lòng nhập đầy đủ thông tin.');

  const slugExisting = chapters.find(
    (chap) => chap.slug === slug && (!currentChapterId || chap.id !== currentChapterId)
  );
  if (slugExisting) return alert('Slug đã tồn tại!');

  const now = new Date().toISOString();

  if (currentChapterId) {
    const chapter = chapters.find((x) => x.id === currentChapterId);
    if (chapter) {
      Object.assign(chapter, {
        story_id: storyId,
        title,
        slug,
        content,
        order_index: orderIndex,
        updated_at: now,
      });
      alert('Cập nhật chương thành công!');
    }
  } else {
    chapters.push({
      id: chapters.length + 1,
      story_id: storyId,
      title,
      slug,
      content,
      order_index: orderIndex,
      created_at: now,
      updated_at: now,
    });
    alert('Thêm chương thành công!');
  }

  // Sắp xếp theo thứ tự chương trong cùng truyện
  chapters.sort((a, b) => {
    if (a.story_id !== b.story_id) return 0;
    return a.order_index - b.order_index;
  });

  renderChaptersTable();
  document.getElementById('chapter-form').style.display = 'none';
}

// ================================
// ✏️ Sửa chương
// ================================
function editChapter(id) {
  const chapter = chapters.find((x) => x.id === id);
  if (!chapter) return;

  window.updateStorySelect();

  const editorContainer = document.getElementById('chapter-editor-container');
  if (editorContainer) editorContainer.innerHTML = '';
  initEditor('chapter-editor-container', chapter.content);

  document.getElementById('chapter-form').style.display = 'block';
  document.getElementById('chapter-form-title').innerText = 'Chỉnh sửa chương';
  document.getElementById('chapter-id').value = chapter.id;
  document.getElementById('chapter-story').value = chapter.story_id;
  document.getElementById('chapter-title').value = chapter.title;
  document.getElementById('chapter-slug').value = chapter.slug;
  document.getElementById('chapter-content').value = chapter.content;
  document.getElementById('chapter-order').value = chapter.order_index;
  currentChapterId = chapter.id;
}

// ================================
// ❌ Xóa chương
// ================================
function deleteChapter(id) {
  if (confirm(`Xóa chương ID ${id}?`)) {
    chapters = chapters.filter((ch) => ch.id !== id);
    alert('Xóa thành công!');
    renderChaptersTable();
  }
}

// ================================
// 🌐 Đăng ký khởi tạo toàn cục
// ================================
window.initChapters = initChapters;
