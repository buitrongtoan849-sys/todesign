let users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', avatar: '' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'author', status: 'active', avatar: '' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', avatar: '' }
];
let currentUserId = null;
let avatarURL = '';

window.users = users; // Expose global

function initUsers() {
  const userAvatarInput = document.getElementById('user-avatar');
  const avatarPreview = document.getElementById('avatar-preview');
  if (userAvatarInput && avatarPreview) {
    userAvatarInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        avatarURL = reader.result;
        avatarPreview.innerHTML = `<img src="${avatarURL}">`;
      };
      reader.readAsDataURL(file);
    });
  }
  const saveBtn = document.getElementById('save-user');
  if (saveBtn) saveBtn.onclick = saveUser;
  renderUserTable();
  window.updateAuthorSelect(); // Update global
}

function renderUserTable() {
  const userTable = document.getElementById('user-table');
  if (!userTable) return;
  userTable.innerHTML = '';
  users.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button class="btn-small" onclick="editUser(${u.id})">Sửa</button>
        <button class="btn-small" onclick="resetPassword(${u.id})">Reset mật khẩu</button>
      </td>`;
    userTable.appendChild(row);
  });
}

function showUserForm() {
  const form = document.getElementById('user-form');
  if (form) form.style.display = 'block';
  const title = document.getElementById('user-form-title');
  if (title) title.innerText = 'Thêm người dùng';
  currentUserId = null;
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const roleSelect = document.getElementById('user-role');
  const statusSelect = document.getElementById('user-status');
  const preview = document.getElementById('avatar-preview');
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (roleSelect) roleSelect.value = 'user';
  if (statusSelect) statusSelect.value = 'active';
  if (preview) preview.innerHTML = 'No Image';
  avatarURL = '';
}

function saveUser() {
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const role = document.getElementById('user-role').value;
  const status = document.getElementById('user-status').value;
  if (!name || !email) return alert('Vui lòng nhập đầy đủ thông tin.');

  if (currentUserId) {
    const u = users.find(x => x.id === currentUserId);
    if (u) {
      Object.assign(u, { name, email, role, status, avatar: avatarURL });
      alert('Cập nhật người dùng thành công!');
    }
  } else {
    users.push({ id: users.length + 1, name, email, role, status, avatar: avatarURL });
    alert('Thêm người dùng thành công!');
  }
  renderUserTable();
  window.updateAuthorSelect();
  document.getElementById('user-form').style.display = 'none';
}

function editUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  document.getElementById('user-form').style.display = 'block';
  document.getElementById('user-form-title').innerText = 'Chỉnh sửa người dùng';
  document.getElementById('user-name').value = u.name;
  document.getElementById('user-email').value = u.email;
  document.getElementById('user-role').value = u.role;
  document.getElementById('user-status').value = u.status;
  const preview = document.getElementById('avatar-preview');
  preview.innerHTML = u.avatar ? `<img src="${u.avatar}">` : 'No Image';
  avatarURL = u.avatar || '';
  currentUserId = u.id;
}

function resetPassword(id) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const token = Math.random().toString(36).substring(2, 15);
  window.passwordResets.push({
    id: window.passwordResets.length + 1,
    user_id: id,
    token,
    otp_code: otp.toString(),
    is_used: false,
    expired_at: new Date(Date.now() + 3600000).toISOString(),
    created_at: new Date().toISOString()
  });
  alert(`Reset mật khẩu cho user ID ${id}\nOTP: ${otp}\nToken: ${token}\n(Đã lưu vào hệ thống)`);
  window.renderPasswordResetsTable();
}

window.initUsers = initUsers;