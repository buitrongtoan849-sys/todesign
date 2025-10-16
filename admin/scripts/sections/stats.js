function initStats() {
  // No dynamic init needed, static content
}

window.initStats = initStats;

// Comments actions for stats
function approveComment(id) {
  const row = document.querySelector(`#pending-comments-table tbody tr:nth-child(${id})`);
  if (row) {
    row.cells[3].innerText = 'Approved';
    row.cells[4].innerHTML = '<span style="color: green;">Đã duyệt</span>';
    alert(`Đã duyệt bình luận ID ${id}!`);
  }
}

function deleteComment(id) {
  if (confirm(`Xóa bình luận ID ${id}?`)) {
    const row = document.querySelector(`#pending-comments-table tbody tr:nth-child(${id})`);
    if (row) row.remove();
    alert(`Đã xóa bình luận ID ${id}!`);
  }
}