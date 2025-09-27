// Lấy tất cả các nút like
const likeBtns = document.querySelectorAll('.like-btn');

// Gắn sự kiện cho từng nút
likeBtns.forEach(btn => {
  const likeCount = btn.querySelector('.like-count');
  let liked = false;
  let count = 0;

  btn.addEventListener('click', () => {
    liked = !liked; // đổi trạng thái

    if (liked) {
      count++;
    } else {
      count--;
    }

    btn.classList.toggle('active', liked);
    likeCount.textContent = count;

    // fetch('/like.php', { ... })
  });
});
