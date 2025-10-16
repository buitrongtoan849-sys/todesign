let comments = [
  { id: 1, post_id: 1, guest_name: 'User A', guest_email: 'a@example.com', content: 'Bình luận hay!', parent_id: null, avatar_color: '#3b82f6', status: 'pending', created_at: new Date().toISOString() },
  { id: 2, post_id: 1, guest_name: 'User B', guest_email: 'b@example.com', content: 'Trả lời bình luận trên.', parent_id: 1, avatar_color: '#10b981', status: 'approved', created_at: new Date().toISOString() },
  { id: 3, post_id: 2, guest_name: 'Guest C', guest_email: 'c@example.com', content: 'Câu hỏi về bài viết.', parent_id: null, avatar_color: null, status: 'rejected', created_at: new Date().toISOString() }
];

window.comments = comments;
window.fullPosts = window.fullPosts || [];

function initComments() {
  renderCommentsTable();
}

function renderCommentsTable() {
  const commentsTable = document.getElementById('comments-table');
  if (!commentsTable) return;
  commentsTable.innerHTML = '';
  comments.forEach(com => {
    const row = document.createElement('tr');
    const postTitle = window.fullPosts.find(p => p.id === com.post_id)?.title || 'Unknown Post';
    const parentComment = com.parent_id ? comments.find(c => c.id === com.parent_id)?.content.substring(0, 20) + '...' : '';
    const statusBadge = `<span class="status-badge status-${com.status}">${com.status}</span>`;
    const createdDate = new Date(com.created_at).toLocaleDateString('vi-VN');
    row.innerHTML = `
      <td>${com.id}</td>
      <td>${com.post_id} (${postTitle})</td>
      <td>${com.guest_name}</td>
      <td>${com.guest_email}</td>
      <td>${com.content.substring(0, 50)}...</td>
      <td>${com.parent_id || ''} (${parentComment})</td>
      <td>${statusBadge}</td>
      <td>${createdDate}</td>
      <td>
        <button class="btn-small" onclick="toggleCommentStatus(${com.id}, 'approved')">Duyệt</button>
        <button class="btn-small" style="background: #f59e0b; margin-left: 5px;" onclick="toggleCommentStatus(${com.id}, 'pending')">Pending</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="toggleCommentStatus(${com.id}, 'rejected')">Từ chối</button>
        <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteCommentFull(${com.id})">Xóa</button>
      </td>`;
    commentsTable.appendChild(row);
  });
}

function toggleCommentStatus(id, status) {
  const comment = comments.find(c => c.id === id);
  if (comment) {
    comment.status = status;
    alert(`Cập nhật trạng thái bình luận ${id} thành ${status}!`);
    renderCommentsTable();
  }
}

function deleteCommentFull(id) {
  if (confirm(`Xóa bình luận ID ${id}?`)) {
    comments = comments.filter(c => c.id !== id);
    alert('Xóa thành công!');
    renderCommentsTable();
  }
}

window.initComments = initComments;