let copyright = { id: 1, copyright_text: "© 2025 WeCook. All rights reserved.", updated_at: new Date().toISOString().slice(0,19).replace('T',' ') };
let socials = [];
let socialId = 1;
let editingSocialId = null;

window.copyright = copyright;
window.socials = socials;

function initFooter() {
  loadFooterForm();
  // Di chuyển event listeners vào đây để chạy sau khi content load
  setupEventListeners();
}

function loadFooterForm() {
  const copyrightText = document.getElementById('copyright-text');
  const currentCopyright = document.getElementById('current-copyright');
  if (copyrightText) copyrightText.value = copyright.copyright_text;
  if (currentCopyright) currentCopyright.textContent = copyright.copyright_text;
  renderSocials();
  clearSocialForm();
}

function setupEventListeners() {
  const saveCopyrightBtn = document.getElementById('save-copyright');
  if (saveCopyrightBtn) {
    saveCopyrightBtn.onclick = () => {
      const text = document.getElementById('copyright-text').value.trim();
      if (!text) return alert("Nhập text bản quyền!");
      copyright.copyright_text = text;
      copyright.updated_at = new Date().toISOString().slice(0,19).replace('T',' ');
      const currentCopyright = document.getElementById('current-copyright');
      if (currentCopyright) currentCopyright.textContent = text;
      alert("Đã lưu bản quyền!");
    };
  }

  const addSocialBtn = document.getElementById('add-social');
  if (addSocialBtn) {
    addSocialBtn.onclick = addOrUpdateSocial;
  }
}

// Các hàm khác giữ nguyên (addOrUpdateSocial, editSocial, renderSocials, deleteSocial, clearSocialForm)
function addOrUpdateSocial() {
  if (editingSocialId !== null) {
    // Update mode
    const url = document.getElementById('social-url').value.trim();
    const order = document.getElementById('social-order').value.trim();
    const status = document.getElementById('social-status').value;
    if (!url) return alert("Nhập URL!");
    const socIndex = socials.findIndex(s => s.id === editingSocialId);
    if (socIndex !== -1) {
      socials[socIndex].url = url;
      socials[socIndex].sort_order = parseInt(order) || 0;
      socials[socIndex].status = status;
      socials[socIndex].updated_at = new Date().toISOString().slice(0,19).replace('T',' ');
    }
    editingSocialId = null;
    const addSocialBtn = document.getElementById('add-social'); // Lấy lại btn ở đây
    if (addSocialBtn) addSocialBtn.textContent = 'Thêm Social';
    renderSocials();
    clearSocialForm();
    alert("Đã cập nhật social!");
  } else {
    // Add mode
    const fileInput = document.getElementById('social-icon');
    const file = fileInput.files[0];
    if (!file) return alert("Chọn file SVG!");
    if (!file.name.toLowerCase().endsWith('.svg')) return alert("Chỉ chấp nhận file SVG!");
    const icon_path = `/uploads/footer/${file.name}`;
    const url = document.getElementById('social-url').value.trim();
    const order = document.getElementById('social-order').value.trim();
    const status = document.getElementById('social-status').value;
    if (!url) return alert("Nhập URL!");
    const soc = {
      id: socialId++,
      icon_path,
      url,
      sort_order: parseInt(order) || 0,
      status,
      created_at: new Date().toISOString().slice(0,19).replace('T',' '),
      updated_at: new Date().toISOString().slice(0,19).replace('T',' ')
    };
    socials.push(soc);
    renderSocials();
    clearSocialForm();
    alert("Đã thêm social!");
  }
}

function editSocial(id) {
  const soc = socials.find(s => s.id === id);
  if (!soc) return;
  editingSocialId = id;
  const addSocialBtn = document.getElementById('add-social');
  if (addSocialBtn) addSocialBtn.textContent = 'Cập nhật Social';
  document.getElementById('social-url').value = soc.url;
  document.getElementById('social-order').value = soc.sort_order;
  document.getElementById('social-status').value = soc.status;
  const label = document.getElementById('social-icon-label');
  if (label) label.textContent = `Chọn Icon SVG (Hiện tại: ${soc.icon_path})`;
}

function renderSocials() {
  const socialTable = document.getElementById('social-table');
  if (!socialTable) return;
  const sorted = [...socials].sort((a,b) => a.sort_order - b.sort_order);
  socialTable.innerHTML = sorted.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.icon_path}</td>
      <td><a href="${s.url}" target="_blank">${s.url.length > 30 ? s.url.slice(0,30) + '...' : s.url}</a></td>
      <td>${s.sort_order}</td>
      <td>${s.status}</td>
      <td>
        <button class="btn-edit" onclick="editSocial(${s.id})">Sửa</button>
        <button class="btn-danger" onclick="deleteSocial(${s.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function deleteSocial(id) {
  if (confirm('Xóa social này?')) {
    socials = socials.filter(s => s.id !== id);
    renderSocials();
    if (editingSocialId === id) {
      editingSocialId = null;
      const addSocialBtn = document.getElementById('add-social');
      if (addSocialBtn) addSocialBtn.textContent = 'Thêm Social';
      clearSocialForm();
    }
  }
}

function clearSocialForm() {
  document.getElementById('social-icon').value = '';
  document.getElementById('social-url').value = '';
  document.getElementById('social-order').value = '';
  document.getElementById('social-status').value = 'active';
  const label = document.getElementById('social-icon-label');
  if (label) label.textContent = 'Chọn Icon SVG';
}

window.initFooter = initFooter;