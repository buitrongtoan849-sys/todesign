let passwordResets = [];

window.passwordResets = passwordResets;

function initPasswordResets() {
  window.renderPasswordResetsTable = renderPasswordResetsTable;
  renderPasswordResetsTable();
}

function renderPasswordResetsTable() {
  const passwordResetsTable = document.getElementById('password-resets-table');
  if (!passwordResetsTable) return;
  passwordResetsTable.innerHTML = '';
  passwordResets.forEach(pr => {
    const row = document.createElement('tr');
    const userName = window.users.find(u => u.id === pr.user_id)?.name || 'Unknown';
    const isUsedBadge = pr.is_used ? '<span style="color: green;">Yes</span>' : '<span style="color: red;">No</span>';
    const createdDate = new Date(pr.created_at).toLocaleDateString('vi-VN');
    const expiredDate = new Date(pr.expired_at).toLocaleDateString('vi-VN');
    row.innerHTML = `
      <td>${pr.id}</td>
      <td>${pr.user_id} (${userName})</td>
      <td>${pr.token.substring(0, 10)}...</td>
      <td>${pr.otp_code || 'N/A'}</td>
      <td>${isUsedBadge}</td>
      <td>${expiredDate}</td>
      <td>${createdDate}</td>
      <td>
        <button class="btn-small" onclick="markUsed(${pr.id})">Mark Used</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteReset(${pr.id})">Xóa</button>
      </td>`;
    passwordResetsTable.appendChild(row);
  });
}

function markUsed(id) {
  const reset = passwordResets.find(r => r.id === id);
  if (reset) {
    reset.is_used = true;
    alert('Đánh dấu đã sử dụng!');
    renderPasswordResetsTable();
  }
}

function deleteReset(id) {
  if (confirm(`Xóa reset ID ${id}?`)) {
    passwordResets = passwordResets.filter(r => r.id !== id);
    alert('Xóa thành công!');
    renderPasswordResetsTable();
  }
}

window.initPasswordResets = initPasswordResets;