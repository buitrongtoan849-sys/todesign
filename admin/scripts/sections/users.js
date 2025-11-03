let users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', avatar: '', password: 'admin123' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'author', status: 'active', avatar: '', password: 'johnpass' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', avatar: '', password: 'janepass' }
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
        avatarPreview.innerHTML = `<img src="${avatarURL}" alt="avatar" style="width:100px;height:100px;">`;
      };
      reader.readAsDataURL(file);
    });
  }
  
  const saveBtn = document.getElementById('save-user');
  if (saveBtn) saveBtn.onclick = saveUser;
  
  renderUserTable();
  if (window.updateAuthorSelect) window.updateAuthorSelect(); // Update global nếu tồn tại
}

function renderUserTable() {
  const userTable = document.getElementById('user-table');
  if (!userTable) return;
  userTable.innerHTML = '';
  users.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.avatar ? `<img src="${u.avatar}" alt="avatar" style="width:50px;height:50px;">` : 'No Image'}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button class="btn-small" onclick="editUser(${u.id})">Sửa</button>
        <button class="btn-small" onclick="resetPassword(${u.id})">Reset mật khẩu</button>
        <button class="btn-small btn-danger" onclick="deleteUser(${u.id})">Xóa</button>
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
  const passwordInput = document.getElementById('user-password');
  const roleSelect = document.getElementById('user-role');
  const statusSelect = document.getElementById('user-status');
  const preview = document.getElementById('avatar-preview');
  
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
  if (roleSelect) roleSelect.value = 'user';
  if (statusSelect) statusSelect.value = 'active';
  if (preview) preview.innerHTML = 'No Image';
  
  avatarURL = '';
}

function saveUser() {
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const passwordInput = document.getElementById('user-password').value; // Lưu lại password như đã nhập
  const role = document.getElementById('user-role').value;
  const status = document.getElementById('user-status').value;
  
  // Nếu là thao tác thêm mới thì yêu cầu phải có mật khẩu
  if (!name || !email || (!currentUserId && !passwordInput)) {
    return alert('Vui lòng nhập đầy đủ thông tin.');
  }
  
  // Xác thực định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return alert('Định dạng email không hợp lệ.');
  }
  
  if (currentUserId) {
    // Chỉnh sửa người dùng
    const u = users.find(x => x.id === currentUserId);
    if (u) {
      u.name = name;
      u.email = email;
      u.role = role;
      u.status = status;
      u.avatar = avatarURL;
      // Cập nhật mật khẩu nếu có nhập giá trị mới
      if (passwordInput) {
        u.password = passwordInput;
      }
      alert('Cập nhật người dùng thành công!');
    }
  } else {
    // Thêm người dùng mới
    users.push({
      id: users.length + 1,
      name,
      email,
      role,
      status,
      avatar: avatarURL,
      password: passwordInput
    });
    alert('Thêm người dùng thành công!');
  }
  
  renderUserTable();
  if (window.updateAuthorSelect) window.updateAuthorSelect();
  document.getElementById('user-form').style.display = 'none';
}

function editUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  
  document.getElementById('user-form').style.display = 'block';
  document.getElementById('user-form-title').innerText = 'Chỉnh sửa người dùng';
  document.getElementById('user-name').value = u.name;
  document.getElementById('user-email').value = u.email;
  // Bỏ trống mật khẩu khi chỉnh sửa để nếu không thay đổi thì giữ nguyên
  document.getElementById('user-password').value = '';
  document.getElementById('user-role').value = u.role;
  document.getElementById('user-status').value = u.status;
  const preview = document.getElementById('avatar-preview');
  preview.innerHTML = u.avatar ? `<img src="${u.avatar}" alt="avatar" style="width:100px;height:100px;">` : 'No Image';
  
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
  alert(`Reset mật khẩu cho user ID ${id}
OTP: ${otp}
Token: ${token}
(Đã lưu vào hệ thống)`);
  window.renderPasswordResetsTable();
}

function deleteUser(id) {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
    users = users.filter(u => u.id !== id);
    alert('Xóa người dùng thành công!');
    renderUserTable();
    if (window.updateAuthorSelect) window.updateAuthorSelect();
  }
}

window.initUsers = initUsers;