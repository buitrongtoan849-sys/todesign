const likeBtn = document.querySelector('.like-btn');
const likeCount = document.querySelector('.like-count');

let liked = false;
let count = 0;

likeBtn.addEventListener('click', () => {
  liked = !liked; // đổi trạng thái like / unlike

  if (liked) {
    count++;
  } else {
    count--;
  }

  likeBtn.classList.toggle('active', liked);
  likeCount.textContent = count;

  // sau này có PHP thì gửi AJAX lên server ở đây
  // fetch('/like.php', { method: 'POST', body: JSON.stringify({ liked, count }) })
});
