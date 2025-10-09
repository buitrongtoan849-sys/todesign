document.addEventListener('DOMContentLoaded', function () {
  const commentContainer = document.querySelector('.comment');
  const mainForm = document.querySelector('.comment-form'); // form bình luận chính
  let replyTemplate = commentContainer ? commentContainer.querySelector('form.comment__reply') : null;

  if (!commentContainer || !mainForm || !replyTemplate) {
    console.warn('Không tìm thấy phần comment hoặc form. Kiểm tra lại HTML.');
    return;
  }

  // --- Chuẩn bị template: move ra body và ẩn để không ảnh hưởng layout ---
  replyTemplate.style.display = 'none';
  document.body.appendChild(replyTemplate); // rút template ra khỏi .comment để tránh chen lẫn

  let activeClone = null;    // form reply đang hiển thị (clone)
  let activeParent = null;   // comment-item cha của form đang hiển thị

  // --- Event delegation: xử lý click trên toàn bộ vùng comment ---
  commentContainer.addEventListener('click', function (ev) {
    // 1) LIKE button (delegation)
    const likeBtn = ev.target.closest('.like-btn');
    if (likeBtn && commentContainer.contains(likeBtn)) {
      ev.preventDefault();
      toggleLike(likeBtn);
      return;
    }

    // 2) REPLY button (delegation)
    const replyBtn = ev.target.closest('.reply-btn');
    if (replyBtn && commentContainer.contains(replyBtn)) {
      ev.preventDefault();
      const commentItem = replyBtn.closest('.comment-item');
      if (!commentItem) return;

      // Nếu click lại trên cùng 1 comment -> ẩn
      if (activeParent === commentItem) {
        removeActiveClone();
        return;
      }

      // Nếu có clone mở ở chỗ khác -> remove trước
      removeActiveClone();

      // Tạo clone từ template, hiển thị dưới comment được click
      activeClone = createReplyClone();
      attachReplySubmit(activeClone, commentItem); // gắn submit handler
      commentItem.insertAdjacentElement('afterend', activeClone);
      activeParent = commentItem;

      // focus vào tên đầu tiên (UX)
      const nameEl = activeClone.querySelector('input[type="text"]');
      if (nameEl) nameEl.focus();
      return;
    }
  });

  // --- Hàm xóa clone hiện tại ---
  function removeActiveClone() {
    if (activeClone && activeClone.parentNode) activeClone.remove();
    activeClone = null;
    activeParent = null;
  }

  // --- Tạo bản sao form trả lời từ template ---
  function createReplyClone() {
    const clone = replyTemplate.cloneNode(true);
    clone.style.display = 'block';
    clone.classList.add('reply-clone');

    // Bỏ id để tránh trùng id (label vẫn ok vì không rely vào id)
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

    // ẩn message success nếu có
    const s = clone.querySelector('.message--success');
    if (s) s.classList.add('hidden-success');

    return clone;
  }

  // --- Gắn sự kiện submit cho clone reply ---
  function attachReplySubmit(formEl, parentComment) {
    // formEl là chính <form> vì template là form
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = formEl.querySelector('input[type="text"]');
      const textarea = formEl.querySelector('textarea');
      const successMessage = formEl.querySelector('.message--success');

      const name = nameInput ? nameInput.value.trim() : '';
      const message = textarea ? textarea.value.trim() : '';

      if (!name || !message) {
        alert('Vui lòng điền đầy đủ thông tin trước khi gửi!');
        return;
      }

      // show success feedback
      if (successMessage) {
        successMessage.classList.remove('hidden-success');
        setTimeout(() => successMessage.classList.add('hidden-success'), 2000);
      }

      // tạo comment mới (reply)
      const newComment = buildCommentNode(name, message, true);

      // chèn ngay sau comment cha (không chen vào template)
      parentComment.insertAdjacentElement('afterend', newComment);

      // Remove clone và reset
      removeActiveClone();
      formEl.reset();
    });
  }

  // --- Gắn submit cho form chính (bình luận tổng) ---
  mainForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = mainForm.querySelector('input[type="text"]');
    const textarea = mainForm.querySelector('textarea');
    const successMessage = mainForm.querySelector('.message--success');

    const name = nameInput ? nameInput.value.trim() : '';
    const message = textarea ? textarea.value.trim() : '';

    if (!name || !message) {
      alert('Vui lòng điền đầy đủ thông tin trước khi gửi!');
      return;
    }

    if (successMessage) {
      successMessage.classList.remove('hidden-success');
      setTimeout(() => successMessage.classList.add('hidden-success'), 2000);
    }

    // tạo comment mới (bình luận chính) -> append vào cuối .comment
    const newComment = buildCommentNode(name, message, false);
    commentContainer.appendChild(newComment);

    mainForm.reset();
  });

  // --- Tạo DOM node cho comment mới ---
  function buildCommentNode(name, message, isReply) {
    const node = document.createElement('div');
    node.className = 'comment-item';
    if (isReply) {
      node.classList.add('comment-item--reply');
      // thụt vào để phân biệt (mày có thể bỏ CSS này nếu muốn)
      node.style.marginLeft = '20px';
      node.style.marginTop = '12px';
    } else {
      node.style.marginTop = '24px';
    }

    // Escape đơn giản để tránh XSS (client-side)
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    node.innerHTML = `
      <div class="comment__header">
        <div class="avatar" role="img" aria-label="Avatar ${safeName.charAt(0).toUpperCase()}">
          <span class="avatar__initials">${safeName.charAt(0).toUpperCase()}</span>
        </div>
        <div class="author-comment">
          <div class="author-time">
            <span class="author">${safeName}</span>
            <span class="dot"></span>
            <span>Vừa xong</span>
          </div>
          <p class="comment__content">${safeMessage}</p>
        </div>
      </div>
      <div class="comment__actions">
        <div class="comment-action like-btn">Thích <span class="like-count">0</span></div>
        <div class="comment-action reply-btn">Trả lời</div>
      </div>
    `;

    // Event delegation đã xử lý like/reply cho phần tử mới (vì nằm trong commentContainer)
    return node;
  }

  // --- Toggle like (local only). Click lần 1 tăng, click 2 giảm ---
  function toggleLike(el) {
    const countSpan = el.querySelector('.like-count');
    let count = parseInt(countSpan.textContent, 10) || 0;

    const already = el.dataset.liked === 'true';
    if (already) {
      count = Math.max(0, count - 1);
      el.dataset.liked = 'false';
      el.classList.remove('active');
    } else {
      count = count + 1;
      el.dataset.liked = 'true';
      el.classList.add('active');
    }
    countSpan.textContent = count;
  }

  // --- Simple escape để tránh inject ---
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});