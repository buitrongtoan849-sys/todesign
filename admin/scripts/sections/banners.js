let banners = [];
let currentEditId = null;
let imageDataURL = '';

function initBanners() {
  const bannerPreview = document.getElementById('banner-preview');
  const bannerColor = document.getElementById('banner-color');
  const bannerImageInput = document.getElementById('banner-image');
  const bannerTable = document.getElementById('banner-table');
  const bannerIdInput = document.getElementById('banner-id');
  const saveBtn = document.getElementById('save-banner');

  if (bannerImageInput) {
    bannerImageInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imageDataURL = reader.result;
          if (bannerPreview) bannerPreview.innerHTML = `<img src="${imageDataURL}" alt="preview">`;
          if (bannerPreview) bannerPreview.style.background = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (bannerColor) {
    bannerColor.addEventListener('input', e => {
      imageDataURL = '';
      if (bannerImageInput) bannerImageInput.value = '';
      if (bannerPreview) bannerPreview.innerHTML = 'Xem trước Banner';
      if (bannerPreview) bannerPreview.style.background = e.target.value;
    });
  }

  if (saveBtn) saveBtn.onclick = saveBanner;
  renderBannerTable();
  resetBannerForm();
}

function renderBannerTable() {
  const bannerTable = document.getElementById('banner-table');
  if (!bannerTable) return;
  bannerTable.innerHTML = '';
  banners.forEach(b => {
    const bgCell = b.image
      ? `<img src="${b.image}" width="120" height="60" style="object-fit:cover;border-radius:6px;">`
      : `<div style="width:120px;height:60px;background:${b.color};border-radius:6px;"></div>`;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${b.id}</td>
      <td>${b.page}</td>
      <td>${b.title}</td>
      <td>${bgCell}</td>
      <td>${b.desc}</td>
      <td>
        <button class="btn-small" onclick="editBanner(${b.id})">Sửa</button>
        <button class="btn-small btn-danger" style="margin-left: 5px;" onclick="deleteBanner(${b.id})">Xóa</button>
      </td>`;
    bannerTable.appendChild(row);
  });
}

function saveBanner() {
  const title = document.getElementById('banner-title').value.trim();
  const desc = document.getElementById('banner-desc').value.trim();
  const pageId = document.getElementById('banner-page').value;
  const pageName = document.querySelector(`#banner-page option[value="${pageId}"]`).textContent;
  const bgColor = document.getElementById('banner-color').value;

  if (!title) return alert('Vui lòng nhập tiêu đề banner!');
  let banner = {
    id: currentEditId || banners.length + 1,
    page: pageName,
    title,
    desc,
    image: imageDataURL,
    color: imageDataURL ? '' : bgColor
  };

  if (currentEditId) {
    const idx = banners.findIndex(b => b.id === currentEditId);
    banners[idx] = banner;
    alert('Đã cập nhật banner!');
  } else {
    banners.push(banner);
    alert('Đã thêm banner mới!');
  }

  renderBannerTable();
  resetBannerForm();
}

function editBanner(id) {
  const b = banners.find(x => x.id === id);
  if (!b) return;
  currentEditId = b.id;
  document.getElementById('banner-title').value = b.title;
  document.getElementById('banner-desc').value = b.desc;
  const bannerPreview = document.getElementById('banner-preview');
  if (bannerPreview) {
    bannerPreview.innerHTML = b.image
      ? `<img src="${b.image}" alt="preview">`
      : 'Xem trước Banner';
  }
  if (bannerPreview) bannerPreview.style.background = b.color || '#3b82f6';
  document.getElementById('banner-color').value = b.color || '#3b82f6';
  imageDataURL = b.image || '';
}

function deleteBanner(id) {
  if (confirm(`Xóa banner ID ${id}?`)) {
    banners = banners.filter(b => b.id !== id);
    alert('Xóa thành công!');
    renderBannerTable();
    if (currentEditId === id) {
      resetBannerForm();
    }
  }
}

function resetBannerForm() {
  document.getElementById('banner-id').value = '';
  document.getElementById('banner-title').value = '';
  document.getElementById('banner-desc').value = '';
  document.getElementById('banner-page').value = '1';
  document.getElementById('banner-image').value = '';
  document.getElementById('banner-color').value = '#3b82f6';
  const bannerPreview = document.getElementById('banner-preview');
  if (bannerPreview) {
    bannerPreview.innerHTML = 'Xem trước Banner';
    bannerPreview.style.background = '#3b82f6';
  }
  imageDataURL = '';
  currentEditId = null;
}

window.initBanners = initBanners;