let pages = [
  { id: 1, system_name: 'home', title: 'Trang chủ', slug: 'home', desc: 'Trang chính của website' },
  { id: 2, system_name: 'about', title: 'Giới thiệu', slug: 'about', desc: 'Thông tin về dự án' }
];
let currentPageId = null;

window.pages = pages; // Expose if needed

function initPages() {
  const saveBtn = document.getElementById('save-page');
  if (saveBtn) saveBtn.onclick = savePage;
  const titleInput = document.getElementById('page-title');
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      const slugInput = document.getElementById('page-slug');
      if (slugInput) slugInput.value = slugify(this.value);
    });
  }
  renderPageTable();
}

function renderPageTable() {
  const pageTableBody = document.querySelector('#page-table tbody');
  if (!pageTableBody) return;
  pageTableBody.innerHTML = '';
  pages.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.system_name}</td>
      <td>${p.title}</td>
      <td>${p.slug}</td>
      <td>${p.desc}</td>
      <td><button class="btn-small" onclick="editPage(${p.id})">Sửa</button></td>
    `;
    pageTableBody.appendChild(row);
  });
}

function showPageForm() {
  const form = document.getElementById('page-form');
  if (form) form.style.display = 'block';
  const title = document.getElementById('page-form-title');
  if (title) title.innerText = 'Thêm trang mới';
  currentPageId = null;
  const systemNameInput = document.getElementById('page-system-name');
  const titleInput = document.getElementById('page-title');
  const slugInput = document.getElementById('page-slug');
  const descInput = document.getElementById('page-desc');
  if (systemNameInput) systemNameInput.value = '';
  if (titleInput) titleInput.value = '';
  if (slugInput) slugInput.value = '';
  if (descInput) descInput.value = '';
}

function editPage(id) {
  const p = pages.find(x => x.id === id);
  if (!p) return;
  document.getElementById('page-form').style.display = 'block';
  document.getElementById('page-form-title').innerText = 'Chỉnh sửa Trang';
  document.getElementById('page-system-name').value = p.system_name;
  document.getElementById('page-title').value = p.title;
  document.getElementById('page-slug').value = p.slug;
  document.getElementById('page-desc').value = p.desc;
  currentPageId = p.id;
}

function savePage() {
  const systemName = document.getElementById('page-system-name').value.trim();
  const title = document.getElementById('page-title').value.trim();
  const slug = document.getElementById('page-slug').value.trim();
  const desc = document.getElementById('page-desc').value.trim();
  if (!systemName || !title || !slug) return alert('Vui lòng nhập đầy đủ thông tin.');

  if (currentPageId) {
    const p = pages.find(x => x.id === currentPageId);
    if (p) {
      p.system_name = systemName;
      p.title = title;
      p.slug = slug;
      p.desc = desc;
      alert('Cập nhật trang thành công!');
    }
  } else {
    pages.push({ id: pages.length + 1, system_name: systemName, title, slug, desc });
    alert('Thêm trang thành công!');
  }
  renderPageTable();
  document.getElementById('page-form').style.display = 'none';
}

window.initPages = initPages;