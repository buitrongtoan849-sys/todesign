let categories = [
  { id: 1, parent_id: null, name: 'Công nghệ', slug: 'cong-nghe', description: 'Danh mục về công nghệ', created_at: new Date().toISOString() },
  { id: 2, parent_id: null, name: 'Giải trí', slug: 'giai-tri', description: 'Danh mục về giải trí', created_at: new Date().toISOString() },
  { id: 3, parent_id: 1, name: 'Lập trình', slug: 'lap-trinh', description: 'Danh mục con về lập trình', created_at: new Date().toISOString() },
  { id: 4, parent_id: 2, name: 'Phim ảnh', slug: 'phim-anh', description: 'Danh mục con về phim ảnh', created_at: new Date().toISOString() },
  { id: 5, parent_id: null, name: 'Truyện', slug: 'truyen', description: 'Danh mục truyện đặc biệt', created_at: new Date().toISOString() }
];
let currentCategoryId = null;

window.categories = categories; // Expose global

function initCategories() {
  const saveBtn = document.getElementById('save-category');
  if (saveBtn) saveBtn.onclick = saveCategory;
  const nameInput = document.getElementById('category-name');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      const slugInput = document.getElementById('category-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }
  window.updateParentSelect();
  renderCategoryTable();
  window.updateCategorySelect(); // Update global
}

function renderCategoryTable() {
  const categoryTable = document.getElementById('category-table');
  if (!categoryTable) return;
  categoryTable.innerHTML = '';
  categories.forEach(c => {
    const row = document.createElement('tr');
    const parentCat = categories.find(cat => cat.id === c.parent_id);
    const parentName = parentCat ? parentCat.name : '';
    const createdDate = new Date(c.created_at).toLocaleDateString('vi-VN');
    row.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.slug}</td>
      <td>${c.description || ''}</td>
      <td>${parentName}</td>
      <td>${createdDate}</td>
      <td>
        <button class="btn-small" onclick="editCategory(${c.id})">Sửa</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteCategory(${c.id})">Xóa</button>
      </td>`;
    categoryTable.appendChild(row);
  });
}

function showCategoryForm() {
  window.updateParentSelect();
  document.getElementById('category-form').style.display = 'block';
  document.getElementById('category-form-title').innerText = 'Thêm danh mục';
  currentCategoryId = null;
  document.getElementById('category-id').value = '';
  document.getElementById('category-name').value = '';
  document.getElementById('category-slug').value = '';
  document.getElementById('category-description').value = '';
  document.getElementById('category-parent').value = '';
}

function saveCategory() {
  const name = document.getElementById('category-name').value.trim();
  const slug = document.getElementById('category-slug').value.trim();
  const description = document.getElementById('category-description').value.trim();
  const parentIdStr = document.getElementById('category-parent').value;
  const parentId = parentIdStr ? parseInt(parentIdStr) : null;

  if (!name || !slug) return alert('Vui lòng nhập tên và slug.');

  // Kiểm tra unique
  const slugExisting = categories.find(cat => cat.slug === slug && (!currentCategoryId || cat.id !== currentCategoryId));
  const nameExisting = categories.find(cat => cat.name === name && (!currentCategoryId || cat.id !== currentCategoryId));
  if (slugExisting) return alert('Slug đã tồn tại!');
  if (nameExisting) return alert('Tên đã tồn tại!');

  // Kiểm tra cycle
  if (parentId && parentId === currentCategoryId) {
    return alert('Không thể chọn chính mình làm danh mục cha!');
  }
  let tempParent = parentId;
  while (tempParent) {
    if (tempParent === currentCategoryId) {
      return alert('Không thể tạo vòng lặp danh mục!');
    }
    const tempCat = categories.find(cat => cat.id === tempParent);
    tempParent = tempCat ? tempCat.parent_id : null;
  }

  const now = new Date().toISOString();
  if (currentCategoryId) {
    const cat = categories.find(x => x.id === currentCategoryId);
    if (cat) {
      Object.assign(cat, { name, slug, description, parent_id: parentId });
      alert('Cập nhật danh mục thành công!');
    }
  } else {
    categories.push({ id: categories.length + 1, parent_id: parentId, name, slug, description, created_at: now });
    alert('Thêm danh mục thành công!');
  }
  renderCategoryTable();
  window.updateCategorySelect();
  document.getElementById('category-form').style.display = 'none';
}

function editCategory(id) {
  const cat = categories.find(x => x.id === id);
  if (!cat) return;
  window.updateParentSelect();
  document.getElementById('category-form').style.display = 'block';
  document.getElementById('category-form-title').innerText = 'Chỉnh sửa danh mục';
  document.getElementById('category-id').value = cat.id;
  document.getElementById('category-name').value = cat.name;
  document.getElementById('category-slug').value = cat.slug;
  document.getElementById('category-description').value = cat.description || '';
  document.getElementById('category-parent').value = cat.parent_id || '';
  currentCategoryId = cat.id;
}

function deleteCategory(id) {
  if (confirm(`Xóa danh mục ID ${id}?`)) {
    const hasChildren = categories.some(c => c.parent_id === id);
    if (hasChildren) return alert('Không thể xóa danh mục có danh mục con!');
    categories = categories.filter(c => c.id !== id);
    alert('Xóa danh mục thành công!');
    renderCategoryTable();
    window.updateCategorySelect();
    window.updateParentSelect();
  }
}

window.initCategories = initCategories;