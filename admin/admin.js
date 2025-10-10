
    // Slugify function
    function slugify(text) {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 -]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // ========== EDITOR FUNCTIONS - Unified Quill for Posts and Chapters ==========
    function initEditor(containerId, content = '') {
      const container = document.getElementById(containerId);
      if (container) {
        const quillId = containerId + '-quill';
        container.innerHTML = `<div id="${quillId}"></div>`;
        const placeholder = containerId.includes('post') ? 'Nhập nội dung bài viết...' : 'Nhập nội dung chương...';
        const quill = new Quill(`#${quillId}`, {
          theme: 'snow',
          placeholder: placeholder,
          modules: {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ]
          }
        });
        if (content) {
          quill.root.innerHTML = content;
        }
        window[containerId + 'Quill'] = quill;
      }
    }

    function getEditorContent(containerId) {
      const quill = window[containerId + 'Quill'];
      if (quill) {
        const content = quill.root.innerHTML;
        const hiddenId = containerId === 'post-editor-container' ? 'post-content' : 'chapter-content';
        document.getElementById(hiddenId).value = content;
        return content;
      }
      return '';
    }

    function formatText(command, editorType = 'post') {
      const containerId = editorType === 'post' ? 'post-editor-container' : 'chapter-editor-container';
      const quill = window[containerId + 'Quill'];
      if (quill) {
        const range = quill.getSelection();
        if (range) {
          if (command === 'bold') quill.format('bold', !range.format.bold);
          else if (command === 'italic') quill.format('italic', !range.format.italic);
          else if (command === 'h2') quill.format('header', 2);
        }
      }
    }

    function insertImage(editorType) {
      const containerId = editorType === 'post' ? 'post-editor-container' : 'chapter-editor-container';
      const quill = window[containerId + 'Quill'];
      if (!quill) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const altPrompt = prompt('Nhập mô tả (alt text) cho hình ảnh:');
        if (altPrompt === null) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', ev.target.result);
          if (altPrompt) {
            quill.insertText(range.index + 1, `\n${altPrompt}`);
          }
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }

    // ========== NAVIGATION ==========
    const navStats = document.getElementById('nav-stats');
    const navUsers = document.getElementById('nav-users');
    const navPages = document.getElementById('nav-pages');
    const navBanners = document.getElementById('nav-banners');
    const navCategories = document.getElementById('nav-categories');
    const navTags = document.getElementById('nav-tags');
    const navContacts = document.getElementById('nav-contacts');
    const navStories = document.getElementById('nav-stories');
    const navPosts = document.getElementById('nav-posts');
    const navChapters = document.getElementById('nav-chapters');
    const navComments = document.getElementById('nav-comments');
    const navPasswordResets = document.getElementById('nav-password-resets');
    const navFooter = document.getElementById('nav-footer');
    const navLogout = document.getElementById('nav-logout');

    const statsSection = document.getElementById('stats-section');
    const userSection = document.getElementById('user-section');
    const pageSection = document.getElementById('page-section');
    const bannerSection = document.getElementById('banner-section');
    const categorySection = document.getElementById('category-section');
    const tagsSection = document.getElementById('tags-section');
    const contactsSection = document.getElementById('contacts-section');
    const storiesSection = document.getElementById('stories-section');
    const postsSection = document.getElementById('posts-section');
    const chaptersSection = document.getElementById('chapters-section');
    const commentsSection = document.getElementById('comments-section');
    const passwordResetsSection = document.getElementById('password-resets-section');
    const footerSection = document.getElementById('footer-section');

    const showSection = (section) => {
      [statsSection, userSection, pageSection, bannerSection, categorySection, tagsSection, contactsSection, storiesSection, postsSection, chaptersSection, commentsSection, passwordResetsSection, footerSection].forEach(s => s.style.display = 'none');
      [navStats, navUsers, navPages, navBanners, navCategories, navTags, navContacts, navStories, navPosts, navChapters, navComments, navPasswordResets, navFooter].forEach(n => n.classList.remove('active'));
      section.nav.classList.add('active');
      section.block.style.display = 'block';
    };

    navStats.onclick = () => showSection({nav: navStats, block: statsSection});
    navUsers.onclick = () => showSection({nav: navUsers, block: userSection});
    navPages.onclick = () => showSection({nav: navPages, block: pageSection});
    navBanners.onclick = () => showSection({nav: navBanners, block: bannerSection});
    navCategories.onclick = () => showSection({nav: navCategories, block: categorySection});
    navTags.onclick = () => showSection({nav: navTags, block: tagsSection});
    navContacts.onclick = () => showSection({nav: navContacts, block: contactsSection});
    navStories.onclick = () => showSection({nav: navStories, block: storiesSection});
    navPosts.onclick = () => showSection({nav: navPosts, block: postsSection});
    navChapters.onclick = () => showSection({nav: navChapters, block: chaptersSection});
    navComments.onclick = () => showSection({nav: navComments, block: commentsSection});
    navPasswordResets.onclick = () => showSection({nav: navPasswordResets, block: passwordResetsSection});
    navFooter.onclick = () => {
      showSection({nav: navFooter, block: footerSection});
      loadFooterForm();
    };
    navLogout.onclick = () => {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        window.location.href = '/login'; // Thay đổi đường dẫn logout thực tế nếu cần
      }
    };

    // ========== PAGE ==========
    let pages = [
      { id: 1, system_name: 'home', title: 'Trang chủ', slug: 'home', desc: 'Trang chính của website' },
      { id: 2, system_name: 'about', title: 'Giới thiệu', slug: 'about', desc: 'Thông tin về dự án' }
    ];
    let currentPageId = null;
    const pageTableBody = document.querySelector('#page-table tbody');

    function renderPageTable() {
      pageTableBody.innerHTML = '';
      pages.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.id}</td>
          <td>${p.system_name}</td>
          <td>${p.title}</td>
          <td>${p.slug}</td>
          <td>${p.desc}</td>
          <td><button class="btn-small" onclick="editPage(${p.id})">Sửa</button></td>
        `;
        pageTableBody.appendChild(row);
      });
    }

    function showPageForm() {
      document.getElementById('page-form').style.display = 'block';
      document.getElementById('page-form-title').innerText = 'Thêm trang mới';
      currentPageId = null;
      document.getElementById('page-system-name').value = '';
      document.getElementById('page-title').value = '';
      document.getElementById('page-slug').value = '';
      document.getElementById('page-desc').value = '';
    }

    function editPage(id) {
      const p = pages.find(x => x.id === id);
      if (!p) return;
      document.getElementById('page-form').style.display = 'block';
      document.getElementById('page-form-title').innerText = 'Chỉnh sửa Trang';
      document.getElementById('page-system-name').value = p.system_name;
      document.getElementById('page-title').value = p.title;
      document.getElementById('page-slug').value = p.slug;
      document.getElementById('page-desc').value = p.desc;
      currentPageId = p.id;
    }

    document.getElementById('save-page').onclick = () => {
      const systemName = document.getElementById('page-system-name').value.trim();
      const title = document.getElementById('page-title').value.trim();
      const slug = document.getElementById('page-slug').value.trim();
      const desc = document.getElementById('page-desc').value.trim();
      if (!systemName || !title || !slug) return alert('Vui lòng nhập đầy đủ thông tin.');

      if (currentPageId) {
        const p = pages.find(x => x.id === currentPageId);
        if (p) {
          p.system_name = systemName;
          p.title = title;
          p.slug = slug;
          p.desc = desc;
          alert('Cập nhật trang thành công!');
        }
      } else {
        pages.push({ id: pages.length + 1, system_name: systemName, title, slug, desc });
        alert('Thêm trang thành công!');
      }
      renderPageTable();
      document.getElementById('page-form').style.display = 'none';
    };

    // Auto slug for pages
    document.getElementById('page-title').addEventListener('input', function() {
      document.getElementById('page-slug').value = slugify(this.value);
    });

    renderPageTable();

    // ========== BANNER ==========
    const bannerPreview = document.getElementById('banner-preview');
    const bannerColor = document.getElementById('banner-color');
    const bannerImageInput = document.getElementById('banner-image');
    const bannerTable = document.getElementById('banner-table');
    const bannerIdInput = document.getElementById('banner-id');
    let imageDataURL = '';
    let banners = [];
    let currentEditId = null;

    // Xử lý upload ảnh
    bannerImageInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imageDataURL = reader.result;
          bannerPreview.innerHTML = `<img src="${imageDataURL}" alt="preview">`;
          bannerPreview.style.background = '';
        };
        reader.readAsDataURL(file);
      }
    });

    // Xử lý chọn màu
    bannerColor.addEventListener('input', e => {
      imageDataURL = '';
      bannerImageInput.value = '';
      bannerPreview.innerHTML = 'Xem trước Banner';
      bannerPreview.style.background = e.target.value;
    });

    // Lưu hoặc cập nhật banner
    document.getElementById('save-banner').onclick = () => {
      const title = document.getElementById('banner-title').value.trim();
      const desc = document.getElementById('banner-desc').value.trim();
      const pageId = document.getElementById('banner-page').value;
      const pageName = document.querySelector(`#banner-page option[value="${pageId}"]`).textContent;
      const bgColor = bannerColor.value;

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
    };

    function renderBannerTable() {
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

    function editBanner(id) {
      const b = banners.find(x => x.id === id);
      if (!b) return;
      currentEditId = b.id;
      document.getElementById('banner-title').value = b.title;
      document.getElementById('banner-desc').value = b.desc;
      document.getElementById('banner-preview').innerHTML = b.image
        ? `<img src="${b.image}" alt="preview">`
        : 'Xem trước Banner';
      bannerPreview.style.background = b.color || '#3b82f6';
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
      bannerImageInput.value = '';
      bannerColor.value = '#3b82f6';
      bannerPreview.innerHTML = 'Xem trước Banner';
      bannerPreview.style.background = '#3b82f6';
      imageDataURL = '';
      currentEditId = null;
    }

    // ========== USERS ==========
    let users = [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', avatar: '' },
      { id: 2, name: 'John Doe', email: 'john@example.com', role: 'author', status: 'active', avatar: '' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', avatar: '' }
    ];
    let currentUserId = null;
    const userTable = document.getElementById('user-table');
    const userAvatarInput = document.getElementById('user-avatar');
    const avatarPreview = document.getElementById('avatar-preview');
    let avatarURL = '';

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

    function renderUserTable() {
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
      document.getElementById('user-form').style.display = 'block';
      document.getElementById('user-form-title').innerText = 'Thêm người dùng';
      currentUserId = null;
      document.getElementById('user-name').value = '';
      document.getElementById('user-email').value = '';
      document.getElementById('user-role').value = 'user';
      document.getElementById('user-status').value = 'active';
      avatarPreview.innerHTML = 'No Image';
      avatarURL = '';
    }

    document.getElementById('save-user').onclick = () => {
      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const role = document.getElementById('user-role').value;
      const status = document.getElementById('user-status').value;
      if (!name || !email) return alert('Vui lòng nhập đầy đủ thông tin.');

      if (currentUserId) {
        const u = users.find(x => x.id === currentUserId);
        Object.assign(u, { name, email, role, status, avatar: avatarURL });
        alert('Cập nhật người dùng thành công!');
      } else {
        users.push({ id: users.length + 1, name, email, role, status, avatar: avatarURL });
        alert('Thêm người dùng thành công!');
      }
      renderUserTable();
      updateAuthorSelects(); // Update selects in stories/posts
      document.getElementById('user-form').style.display = 'none';
    };

    function editUser(id) {
      const u = users.find(x => x.id === id);
      if (!u) return;
      document.getElementById('user-form').style.display = 'block';
      document.getElementById('user-form-title').innerText = 'Chỉnh sửa người dùng';
      document.getElementById('user-name').value = u.name;
      document.getElementById('user-email').value = u.email;
      document.getElementById('user-role').value = u.role;
      document.getElementById('user-status').value = u.status;
      avatarPreview.innerHTML = u.avatar ? `<img src="${u.avatar}">` : 'No Image';
      avatarURL = u.avatar || '';
      currentUserId = u.id;
    }

    function resetPassword(id) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const token = Math.random().toString(36).substring(2, 15);
      // Add to password_resets
      passwordResets.push({
        id: passwordResets.length + 1,
        user_id: id,
        token,
        otp_code: otp.toString(),
        is_used: false,
        expired_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        created_at: new Date().toISOString()
      });
      alert(`Reset mật khẩu cho user ID ${id}\nOTP: ${otp}\nToken: ${token}\n(Đã lưu vào hệ thống)`);
      renderPasswordResetsTable();
    }

    renderUserTable();

    // ========== CATEGORIES ==========
    let categories = [
      { id: 1, parent_id: null, name: 'Công nghệ', slug: 'cong-nghe', description: 'Danh mục về công nghệ', created_at: new Date().toISOString() },
      { id: 2, parent_id: null, name: 'Giải trí', slug: 'giai-tri', description: 'Danh mục về giải trí', created_at: new Date().toISOString() },
      { id: 3, parent_id: 1, name: 'Lập trình', slug: 'lap-trinh', description: 'Danh mục con về lập trình', created_at: new Date().toISOString() },
      { id: 4, parent_id: 2, name: 'Phim ảnh', slug: 'phim-anh', description: 'Danh mục con về phim ảnh', created_at: new Date().toISOString() },
      { id: 5, parent_id: null, name: 'Truyện', slug: 'truyen', description: 'Danh mục truyện đặc biệt', created_at: new Date().toISOString() }
    ];
    let currentCategoryId = null;
    const categoryTable = document.getElementById('category-table');
    const categoryParentSelect = document.getElementById('category-parent');

    function updateParentSelect() {
      categoryParentSelect.innerHTML = '<option value="">-- Không có --</option>';
      categories.filter(c => c.parent_id === null).forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        categoryParentSelect.appendChild(option);
      });
    }

    function renderCategoryTable() {
      categoryTable.innerHTML = '';
      categories.forEach(c => {
        const row = document.createElement('tr');
        const parentCat = categories.find(cat => cat.id === c.parent_id);
        const parentName = parentCat ? parentCat.name : '';
        const createdDate = new Date(c.created_at).toLocaleDateString('vi-VN');
        row.innerHTML = `
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.slug}</td>
          <td>${c.description || ''}</td>
          <td>${parentName}</td>
          <td>${createdDate}</td>
          <td>
            <button class="btn-small" onclick="editCategory(${c.id})">Sửa</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteCategory(${c.id})">Xóa</button>
          </td>`;
        categoryTable.appendChild(row);
      });
    }

    function showCategoryForm() {
      updateParentSelect();
      document.getElementById('category-form').style.display = 'block';
      document.getElementById('category-form-title').innerText = 'Thêm danh mục';
      currentCategoryId = null;
      document.getElementById('category-id').value = '';
      document.getElementById('category-name').value = '';
      document.getElementById('category-slug').value = '';
      document.getElementById('category-description').value = '';
      document.getElementById('category-parent').value = '';
    }

    document.getElementById('save-category').onclick = () => {
      const name = document.getElementById('category-name').value.trim();
      const slug = document.getElementById('category-slug').value.trim();
      const description = document.getElementById('category-description').value.trim();
      const parentIdStr = document.getElementById('category-parent').value;
      const parentId = parentIdStr ? parseInt(parentIdStr) : null;

      if (!name || !slug) return alert('Vui lòng nhập tên và slug.');

      // Kiểm tra unique slug và name (toàn cục theo ERD)
      const slugExisting = categories.find(cat => cat.slug === slug && (!currentCategoryId || cat.id !== currentCategoryId));
      const nameExisting = categories.find(cat => cat.name === name && (!currentCategoryId || cat.id !== currentCategoryId));
      if (slugExisting) return alert('Slug đã tồn tại!');
      if (nameExisting) return alert('Tên đã tồn tại!');

      // Kiểm tra self-parent và cycle
      if (parentId && parentId === currentCategoryId) {
        return alert('Không thể chọn chính mình làm danh mục cha!');
      }

      let tempParent = parentId;
      while (tempParent) {
        if (tempParent === currentCategoryId) {
          return alert('Không thể tạo vòng lặp danh mục!');
        }
        const tempCat = categories.find(cat => cat.id === tempParent);
        tempParent = tempCat ? tempCat.parent_id : null;
      }

      const now = new Date().toISOString();
      if (currentCategoryId) {
        const cat = categories.find(x => x.id === currentCategoryId);
        if (cat) {
          Object.assign(cat, { name, slug, description, parent_id: parentId });
          alert('Cập nhật danh mục thành công!');
        }
      } else {
        categories.push({ id: categories.length + 1, parent_id: parentId, name, slug, description, created_at: now });
        alert('Thêm danh mục thành công!');
      }
      renderCategoryTable();
      updateCategorySelect(); // Update in posts
      document.getElementById('category-form').style.display = 'none';
    };

    function editCategory(id) {
      const cat = categories.find(x => x.id === id);
      if (!cat) return;
      updateParentSelect();
      document.getElementById('category-form').style.display = 'block';
      document.getElementById('category-form-title').innerText = 'Chỉnh sửa danh mục';
      document.getElementById('category-id').value = cat.id;
      document.getElementById('category-name').value = cat.name;
      document.getElementById('category-slug').value = cat.slug;
      document.getElementById('category-description').value = cat.description || '';
      document.getElementById('category-parent').value = cat.parent_id || '';
      currentCategoryId = cat.id;
    }

    function deleteCategory(id) {
      if (confirm(`Xóa danh mục ID ${id}?`)) {
        const hasChildren = categories.some(c => c.parent_id === id);
        if (hasChildren) return alert('Không thể xóa danh mục có danh mục con!');
        categories = categories.filter(c => c.id !== id);
        alert('Xóa danh mục thành công!');
        renderCategoryTable();
        updateCategorySelect();
      }
    }

    // Auto slug for categories
    document.getElementById('category-name').addEventListener('input', function() {
      document.getElementById('category-slug').value = slugify(this.value);
    });

    renderCategoryTable();

    // ========== TAGS ==========
    let tags = [
      { id: 1, name: 'Công nghệ', slug: 'cong-nghe', created_at: new Date().toISOString() },
      { id: 2, name: 'Giải trí', slug: 'giai-tri', created_at: new Date().toISOString() },
      { id: 3, name: 'Lập trình', slug: 'lap-trinh', created_at: new Date().toISOString() }
    ];
    let currentTagId = null;
    const tagTable = document.getElementById('tag-table');

    function renderTagTable() {
      tagTable.innerHTML = '';
      tags.forEach(t => {
        const row = document.createElement('tr');
        const createdDate = new Date(t.created_at).toLocaleDateString('vi-VN');
        row.innerHTML = `
          <td>${t.id}</td>
          <td>${t.name}</td>
          <td>${t.slug}</td>
          <td>${createdDate}</td>
          <td>
            <button class="btn-small" onclick="editTag(${t.id})">Sửa</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteTag(${t.id})">Xóa</button>
          </td>`;
        tagTable.appendChild(row);
      });
    }

    function showTagForm() {
      document.getElementById('tag-form').style.display = 'block';
      document.getElementById('tag-form-title').innerText = 'Thêm tag';
      currentTagId = null;
      document.getElementById('tag-id').value = '';
      document.getElementById('tag-name').value = '';
      document.getElementById('tag-slug').value = '';
    }

    document.getElementById('save-tag').onclick = () => {
      const name = document.getElementById('tag-name').value.trim();
      const slug = document.getElementById('tag-slug').value.trim();

      if (!name || !slug) return alert('Vui lòng nhập tên và slug.');

      const slugExisting = tags.find(tag => tag.slug === slug && (!currentTagId || tag.id !== currentTagId));
      const nameExisting = tags.find(tag => tag.name === name && (!currentTagId || tag.id !== currentTagId));
      if (slugExisting) return alert('Slug đã tồn tại!');
      if (nameExisting) return alert('Tên đã tồn tại!');

      const now = new Date().toISOString();
      if (currentTagId) {
        const tag = tags.find(x => x.id === currentTagId);
        if (tag) {
          Object.assign(tag, { name, slug });
          alert('Cập nhật tag thành công!');
        }
      } else {
        tags.push({ id: tags.length + 1, name, slug, created_at: now });
        alert('Thêm tag thành công!');
      }
      renderTagTable();
      renderPostTagTable();
      document.getElementById('tag-form').style.display = 'none';
    };

    function editTag(id) {
      const tag = tags.find(x => x.id === id);
      if (!tag) return;
      document.getElementById('tag-form').style.display = 'block';
      document.getElementById('tag-form-title').innerText = 'Chỉnh sửa tag';
      document.getElementById('tag-id').value = tag.id;
      document.getElementById('tag-name').value = tag.name;
      document.getElementById('tag-slug').value = tag.slug;
      currentTagId = tag.id;
    }

    function deleteTag(id) {
      if (confirm(`Xóa tag ID ${id}?`)) {
        const isUsed = postTags.some(pt => pt.tag_id === id);
        if (isUsed) return alert('Không thể xóa tag đang được sử dụng trong post-tags!');
        tags = tags.filter(t => t.id !== id);
        alert('Xóa tag thành công!');
        renderTagTable();
        renderPostTagTable();
      }
    }

    // Auto slug for tags
    document.getElementById('tag-name').addEventListener('input', function() {
      document.getElementById('tag-slug').value = slugify(this.value);
    });

    // ========== POST-TAGS ==========
    let posts = [
      { id: 1, title: 'Bài viết về công nghệ mới' },
      { id: 2, title: 'Hướng dẫn lập trình Python' },
      { id: 3, title: 'Review phim hay nhất 2023' }
    ];
    let postTags = [
      { post_id: 1, tag_id: 1 },
      { post_id: 2, tag_id: 3 },
      { post_id: 3, tag_id: 2 }
    ];
    const postTagTable = document.getElementById('post-tag-table');
    const postSelect = document.getElementById('post-tag-post');
    const tagSelect = document.getElementById('post-tag-tag');

    function updatePostSelect() {
      postSelect.innerHTML = '';
      posts.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.id}: ${p.title}`;
        postSelect.appendChild(option);
      });
    }

    function updateTagSelect() {
      tagSelect.innerHTML = '';
      tags.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = `${t.id}: ${t.name}`;
        tagSelect.appendChild(option);
      });
    }

    function renderPostTagTable() {
      postTagTable.innerHTML = '';
      postTags.forEach(pt => {
        const post = posts.find(p => p.id === pt.post_id);
        const tag = tags.find(t => t.id === pt.tag_id);
        if (!post || !tag) return;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${pt.post_id}</td>
          <td>${post.title}</td>
          <td>${pt.tag_id}</td>
          <td>${tag.name}</td>
          <td>
            <button class="btn-small" style="background: #ef4444;" onclick="deletePostTag(${pt.post_id}, ${pt.tag_id})">Xóa</button>
          </td>`;
        postTagTable.appendChild(row);
      });
    }

    function showPostTagForm() {
      updatePostSelect();
      updateTagSelect();
      document.getElementById('post-tag-form').style.display = 'block';
      document.getElementById('post-tag-form-title').innerText = 'Thêm liên kết Post-Tag';
      postSelect.value = '';
      tagSelect.value = '';
    }

    document.getElementById('save-post-tag').onclick = () => {
      const postId = parseInt(postSelect.value);
      const tagId = parseInt(tagSelect.value);
      if (!postId || !tagId) return alert('Vui lòng chọn post và tag.');

      const existing = postTags.find(pt => pt.post_id === postId && pt.tag_id === tagId);
      if (existing) return alert('Liên kết này đã tồn tại!');

      postTags.push({ post_id: postId, tag_id: tagId });
      alert('Thêm liên kết thành công!');
      renderPostTagTable();
      document.getElementById('post-tag-form').style.display = 'none';
    };

    function deletePostTag(postId, tagId) {
      if (confirm(`Xóa liên kết Post ${postId} - Tag ${tagId}?`)) {
        postTags = postTags.filter(pt => !(pt.post_id === postId && pt.tag_id === tagId));
        alert('Xóa liên kết thành công!');
        renderPostTagTable();
      }
    }

    renderTagTable();
    updatePostSelect();
    updateTagSelect();
    renderPostTagTable();

    // ========== CONTACTS ==========
    let contacts = [
      { id: 1, user_id: null, name: 'Nguyễn Văn A', email: 'a@example.com', message: 'Tôi có câu hỏi về sản phẩm.', created_at: new Date().toISOString() },
      { id: 2, user_id: 2, name: 'John Doe', email: 'john@example.com', message: 'Gợi ý cải thiện website.', created_at: new Date().toISOString() }
    ];
    const contactsTable = document.getElementById('contacts-table');

    function renderContactsTable() {
      contactsTable.innerHTML = '';
      contacts.forEach(c => {
        const row = document.createElement('tr');
        const createdDate = new Date(c.created_at).toLocaleDateString('vi-VN');
        const userName = c.user_id ? users.find(u => u.id === c.user_id)?.name || 'Unknown' : 'Guest';
        row.innerHTML = `
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.message.substring(0, 50)}...</td>
          <td>${c.user_id || 'Guest'}</td>
          <td>${createdDate}</td>
          <td>
            <button class="btn-small" onclick="viewContact(${c.id})">Xem</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteContact(${c.id})">Xóa</button>
          </td>`;
        contactsTable.appendChild(row);
      });
    }

    function viewContact(id) {
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        document.getElementById('detail-id').textContent = contact.id;
        document.getElementById('detail-name').textContent = contact.name;
        document.getElementById('detail-email').textContent = contact.email;
        document.getElementById('detail-message').textContent = contact.message;
        document.getElementById('detail-user-id').textContent = contact.user_id || 'Guest';
        document.getElementById('detail-created-at').textContent = new Date(contact.created_at).toLocaleString('vi-VN');
        document.getElementById('contact-details').style.display = 'block';
      }
    }

    function hideContactDetails() {
      document.getElementById('contact-details').style.display = 'none';
    }

    function deleteContact(id) {
      if (confirm(`Xóa liên hệ ID ${id}?`)) {
        contacts = contacts.filter(c => c.id !== id);
        alert('Xóa thành công!');
        renderContactsTable();
        hideContactDetails(); // Ẩn nếu đang mở
      }
    }

    renderContactsTable();

    // ========== STORIES ==========
    let stories = [
      { id: 1, title: 'Truyện Kiếm Hiệp Hay', slug: 'truyen-kiem-hiep-hay', description: 'Một câu chuyện kiếm hiệp hấp dẫn.', cover_url: '', author_id: 2, status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, title: 'Huyền Thoại Hiện Đại', slug: 'huyen-thoai-hien-dai', description: 'Câu chuyện fantasy hiện đại.', cover_url: '', author_id: 3, status: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    let currentStoryId = null;
    const storiesTable = document.getElementById('stories-table');
    const storyCoverInput = document.getElementById('story-cover');
    const coverPreview = document.getElementById('cover-preview');
    let storyCoverURL = '';

    function updateAuthorSelect() {
      const selects = [document.getElementById('story-author'), document.getElementById('post-author')];
      selects.forEach(select => {
        if (select) {
          select.innerHTML = '<option value="">-- Chọn author --</option>';
          users.filter(u => u.role === 'author').forEach(u => {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.id}: ${u.name}`;
            select.appendChild(option);
          });
        }
      });
    }

    storyCoverInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          storyCoverURL = reader.result;
          coverPreview.innerHTML = `<img src="${storyCoverURL}">`;
        };
        reader.readAsDataURL(file);
      }
    });

    function renderStoriesTable() {
      storiesTable.innerHTML = '';
      stories.forEach(s => {
        const row = document.createElement('tr');
        const authorName = users.find(u => u.id === s.author_id)?.name || 'Unknown';
        const statusBadge = `<span class="status-badge status-${s.status}">${s.status}</span>`;
        const coverCell = s.cover_url ? `<img src="${s.cover_url}" width="60" height="40" style="object-fit:cover;">` : 'No Cover';
        const createdDate = new Date(s.created_at).toLocaleDateString('vi-VN');
        row.innerHTML = `
          <td>${s.id}</td>
          <td>${s.title}</td>
          <td>${s.slug}</td>
          <td>${s.description.substring(0, 30)}...</td>
          <td>${authorName}</td>
          <td>${statusBadge}</td>
          <td>${coverCell}</td>
          <td>
            <button class="btn-small" onclick="editStory(${s.id})">Sửa</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteStory(${s.id})">Xóa</button>
          </td>`;
        storiesTable.appendChild(row);
      });
    }

    function showStoryForm() {
      updateAuthorSelect();
      updateStorySelect(); // For chapters/posts
      document.getElementById('story-form').style.display = 'block';
      document.getElementById('story-form-title').innerText = 'Thêm truyện mới';
      currentStoryId = null;
      document.getElementById('story-id').value = '';
      document.getElementById('story-title').value = '';
      document.getElementById('story-slug').value = '';
      document.getElementById('story-description').value = '';
      document.getElementById('story-author').value = '';
      document.getElementById('story-status').value = 'draft';
      coverPreview.innerHTML = 'No Image';
      storyCoverInput.value = '';
      storyCoverURL = '';
    }

    document.getElementById('save-story').onclick = () => {
      const title = document.getElementById('story-title').value.trim();
      const slug = document.getElementById('story-slug').value.trim();
      const description = document.getElementById('story-description').value.trim();
      const authorId = parseInt(document.getElementById('story-author').value);
      const status = document.getElementById('story-status').value;

      if (!title || !slug || !authorId) return alert('Vui lòng nhập đầy đủ thông tin.');

      const slugExisting = stories.find(st => st.slug === slug && (!currentStoryId || st.id !== currentStoryId));
      if (slugExisting) return alert('Slug đã tồn tại!');

      const now = new Date().toISOString();
      if (currentStoryId) {
        const story = stories.find(x => x.id === currentStoryId);
        if (story) {
          Object.assign(story, { title, slug, description, author_id: authorId, status, cover_url: storyCoverURL, updated_at: now });
          alert('Cập nhật truyện thành công!');
        }
      } else {
        stories.push({ id: stories.length + 1, title, slug, description, cover_url: storyCoverURL, author_id: authorId, status, created_at: now, updated_at: now });
        alert('Thêm truyện thành công!');
      }
      renderStoriesTable();
      updateStorySelect();
      document.getElementById('story-form').style.display = 'none';
    };

    function editStory(id) {
      const story = stories.find(x => x.id === id);
      if (!story) return;
      updateAuthorSelect();
      document.getElementById('story-form').style.display = 'block';
      document.getElementById('story-form-title').innerText = 'Chỉnh sửa truyện';
      document.getElementById('story-id').value = story.id;
      document.getElementById('story-title').value = story.title;
      document.getElementById('story-slug').value = story.slug;
      document.getElementById('story-description').value = story.description;
      document.getElementById('story-author').value = story.author_id;
      document.getElementById('story-status').value = story.status;
      coverPreview.innerHTML = story.cover_url ? `<img src="${story.cover_url}">` : 'No Image';
      storyCoverURL = story.cover_url || '';
      currentStoryId = story.id;
    }

    function deleteStory(id) {
      if (confirm(`Xóa truyện ID ${id}?`)) {
        // Check if has chapters
        const hasChapters = chapters.some(ch => ch.story_id === id);
        if (hasChapters) return alert('Không thể xóa truyện có chương!');
        stories = stories.filter(s => s.id !== id);
        alert('Xóa thành công!');
        renderStoriesTable();
        updateStorySelect();
      }
    }

    // Auto slug for stories
    document.getElementById('story-title').addEventListener('input', function() {
      document.getElementById('story-slug').value = slugify(this.value);
    });

    updateAuthorSelect();
    renderStoriesTable();

    // ========== POSTS ==========
    let fullPosts = [ // Full data for posts
      { id: 1, title: 'Bài viết về công nghệ mới', slug: 'bai-viet-cong-nghe-moi', content: '<p>Nội dung bài viết...</p><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Alt4XvG4hM1g5Kk5R0XU4iY2v//Z" alt="Hình ảnh công nghệ" style="max-width:100%; height:auto; display:block; margin:10px 0;">', youtube_url: '', thumbnail_url: '', author_id: 2, category_id: 1, story_id: null, status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    let currentPostId = null;
    const postsTable = document.getElementById('posts-table');
    const postThumbnailInput = document.getElementById('post-thumbnail');
    const thumbnailPreview = document.getElementById('thumbnail-preview');
    let postThumbnailURL = '';

    function updateCategorySelect() {
      const select = document.getElementById('post-category');
      if (select) {
        select.innerHTML = '<option value="">-- Chọn category --</option>';
        categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          select.appendChild(option);
        });
      }
    }

    function updateStorySelect() {
      const selects = [document.getElementById('post-story'), document.getElementById('chapter-story')];
      selects.forEach(select => {
        if (select) {
          select.innerHTML = '<option value="">-- Không có --</option>';
          stories.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = `${s.id}: ${s.title}`;
            select.appendChild(option);
          });
        }
      });
    }

    postThumbnailInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          postThumbnailURL = reader.result;
          thumbnailPreview.innerHTML = `<img src="${postThumbnailURL}">`;
        };
        reader.readAsDataURL(file);
      }
    });

    function renderPostsTable() {
      postsTable.innerHTML = '';
      fullPosts.forEach(p => {
        const row = document.createElement('tr');
        const categoryName = categories.find(c => c.id === p.category_id)?.name || 'Uncategorized';
        const storyTitle = p.story_id ? stories.find(s => s.id === p.story_id)?.title || 'Unknown' : '';
        const authorName = users.find(u => u.id === p.author_id)?.name || 'Unknown';
        const statusBadge = `<span class="status-badge status-${p.status}">${p.status}</span>`;
        const thumbCell = p.thumbnail_url ? `<img src="${p.thumbnail_url}" width="60" height="40" style="object-fit:cover;">` : 'No Thumb';
        row.innerHTML = `
          <td>${p.id}</td>
          <td>${p.title}</td>
          <td>${p.slug}</td>
          <td>${categoryName}</td>
          <td>${p.story_id || ''} (${storyTitle})</td>
          <td>${authorName}</td>
          <td>${statusBadge}</td>
          <td>${thumbCell}</td>
          <td>
            <button class="btn-small" onclick="editPost(${p.id})">Sửa</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deletePost(${p.id})">Xóa</button>
          </td>`;
        postsTable.appendChild(row);
      });
      // Update posts array for post-tags
      posts = fullPosts.map(p => ({ id: p.id, title: p.title }));
      updatePostSelect();
    }

    function showPostForm() {
      updateAuthorSelect();
      updateCategorySelect();
      updateStorySelect();
      document.getElementById('post-editor-container').innerHTML = ''; // Clear previous
      initEditor('post-editor-container'); // Init Quill
      document.getElementById('post-form').style.display = 'block';
      document.getElementById('post-form-title').innerText = 'Thêm bài viết mới';
      currentPostId = null;
      document.getElementById('post-id').value = '';
      document.getElementById('post-title').value = '';
      document.getElementById('post-slug').value = '';
      document.getElementById('post-content').value = '';
      document.getElementById('post-youtube').value = '';
      document.getElementById('post-author').value = '';
      document.getElementById('post-category').value = '';
      document.getElementById('post-story').value = '';
      document.getElementById('post-status').value = 'draft';
      thumbnailPreview.innerHTML = 'No Image';
      postThumbnailInput.value = '';
      postThumbnailURL = '';
    }

    document.getElementById('save-post').onclick = () => {
      const title = document.getElementById('post-title').value.trim();
      const slug = document.getElementById('post-slug').value.trim();
      const content = getEditorContent('post-editor-container');
      const youtube_url = document.getElementById('post-youtube').value.trim();
      const authorId = parseInt(document.getElementById('post-author').value);
      const categoryId = parseInt(document.getElementById('post-category').value);
      const storyId = parseInt(document.getElementById('post-story').value) || null;
      const status = document.getElementById('post-status').value;

      if (!title || !slug || !authorId || !categoryId) return alert('Vui lòng nhập đầy đủ thông tin bắt buộc.');

      const slugExisting = fullPosts.find(po => po.slug === slug && (!currentPostId || po.id !== currentPostId));
      if (slugExisting) return alert('Slug đã tồn tại!');

      const now = new Date().toISOString();
      if (currentPostId) {
        const post = fullPosts.find(x => x.id === currentPostId);
        if (post) {
          Object.assign(post, { title, slug, content, youtube_url, thumbnail_url: postThumbnailURL, author_id: authorId, category_id: categoryId, story_id: storyId, status, updated_at: now });
          alert('Cập nhật bài viết thành công!');
        }
      } else {
        fullPosts.push({ id: fullPosts.length + 1, title, slug, content, youtube_url, thumbnail_url: postThumbnailURL, author_id: authorId, category_id: categoryId, story_id: storyId, status, created_at: now, updated_at: now });
        alert('Thêm bài viết thành công!');
      }
      renderPostsTable();
      renderPostTagTable();
      document.getElementById('post-form').style.display = 'none';
    };

    function editPost(id) {
      const post = fullPosts.find(x => x.id === id);
      if (!post) return;
      updateAuthorSelect();
      updateCategorySelect();
      updateStorySelect();
      document.getElementById('post-editor-container').innerHTML = ''; // Clear
      initEditor('post-editor-container', post.content); // Init with content
      document.getElementById('post-form').style.display = 'block';
      document.getElementById('post-form-title').innerText = 'Chỉnh sửa bài viết';
      document.getElementById('post-id').value = post.id;
      document.getElementById('post-title').value = post.title;
      document.getElementById('post-slug').value = post.slug;
      document.getElementById('post-content').value = post.content;
      document.getElementById('post-youtube').value = post.youtube_url;
      document.getElementById('post-author').value = post.author_id;
      document.getElementById('post-category').value = post.category_id;
      document.getElementById('post-story').value = post.story_id || '';
      document.getElementById('post-status').value = post.status;
      thumbnailPreview.innerHTML = post.thumbnail_url ? `<img src="${post.thumbnail_url}">` : 'No Image';
      postThumbnailURL = post.thumbnail_url || '';
      currentPostId = post.id;
    }

    function deletePost(id) {
      if (confirm(`Xóa bài viết ID ${id}?`)) {
        const hasComments = comments.some(com => com.post_id === id);
        if (hasComments) return alert('Không thể xóa bài viết có bình luận!');
        fullPosts = fullPosts.filter(p => p.id !== id);
        postTags = postTags.filter(pt => pt.post_id !== id);
        alert('Xóa thành công!');
        renderPostsTable();
        renderPostTagTable();
      }
    }

    // Auto slug for posts
    document.getElementById('post-title').addEventListener('input', function() {
      document.getElementById('post-slug').value = slugify(this.value);
    });

    updateCategorySelect();
    updateStorySelect();
    renderPostsTable();

    // ========== CHAPTERS ==========
    let chapters = [
      { id: 1, story_id: 1, title: 'Chương 1: Khởi đầu', slug: 'chuong-1-khoi-dau', content: '<p>Nội dung chương 1 với hình ảnh...</p><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Alt4XvG4hM1g5Kk5R0XU4iY2v//Z" alt="Hình ảnh chương 1" style="max-width:100%; height:auto; display:block; margin:10px 0;"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Alt4XvG4hM1g5Kk5R0XU4iY2v//Z" alt="Hình ảnh thứ hai" style="max-width:100%; height:auto; display:block; margin:10px 0;">', order_index: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, story_id: 1, title: 'Chương 2: Cuộc phiêu lưu', slug: 'chuong-2-cuoc-phieu-luu', content: '<p>Nội dung chương 2...</p>', order_index: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    let currentChapterId = null;
    const chaptersTable = document.getElementById('chapters-table');

    function renderChaptersTable() {
      chaptersTable.innerHTML = '';
      chapters.forEach(ch => {
        const row = document.createElement('tr');
        const storyTitle = stories.find(s => s.id === ch.story_id)?.title || 'Unknown';
        const contentPreview = ch.content.substring(0, 50) + '...';
        const createdDate = new Date(ch.created_at).toLocaleDateString('vi-VN');
        row.innerHTML = `
          <td>${ch.id}</td>
          <td>${ch.story_id} (${storyTitle})</td>
          <td>${ch.title}</td>
          <td>${ch.slug}</td>
          <td>${ch.order_index}</td>
          <td>${contentPreview}</td>
          <td>
            <button class="btn-small" onclick="editChapter(${ch.id})">Sửa</button>
            <button class="btn-small" style="background: #ef4444; margin-left: 5px;" onclick="deleteChapter(${ch.id})">Xóa</button>
          </td>`;
        chaptersTable.appendChild(row);
      });
    }

    function showChapterForm() {
      updateStorySelect();
      document.getElementById('chapter-editor-container').innerHTML = ''; // Clear previous
      initEditor('chapter-editor-container'); // Init Quill
      document.getElementById('chapter-form').style.display = 'block';
      document.getElementById('chapter-form-title').innerText = 'Thêm chương mới';
      currentChapterId = null;
      document.getElementById('chapter-id').value = '';
      document.getElementById('chapter-story').value = '';
      document.getElementById('chapter-title').value = '';
      document.getElementById('chapter-slug').value = '';
      document.getElementById('chapter-content').value = '';
      document.getElementById('chapter-order').value = '';
    }

    document.getElementById('save-chapter').onclick = () => {
      const storyId = parseInt(document.getElementById('chapter-story').value);
      const title = document.getElementById('chapter-title').value.trim();
      const slug = document.getElementById('chapter-slug').value.trim();
      const content = getEditorContent('chapter-editor-container');
      const orderIndex = parseInt(document.getElementById('chapter-order').value);

      if (!storyId || !title || !slug || !orderIndex) return alert('Vui lòng nhập đầy đủ thông tin.');

      // Slug unique toàn cục theo ERD
      const slugExisting = chapters.find(chap => chap.slug === slug && (!currentChapterId || chap.id !== currentChapterId));
      if (slugExisting) return alert('Slug đã tồn tại!');

      const now = new Date().toISOString();
      if (currentChapterId) {
        const chapter = chapters.find(x => x.id === currentChapterId);
        if (chapter) {
          Object.assign(chapter, { story_id: storyId, title, slug, content, order_index: orderIndex, updated_at: now });
          alert('Cập nhật chương thành công!');
        }
      } else {
        chapters.push({ id: chapters.length + 1, story_id: storyId, title, slug, content, order_index: orderIndex, created_at: now, updated_at: now });
        alert('Thêm chương thành công!');
      }
      // Re-sort chapters by order_index per story if needed
      chapters.sort((a, b) => {
        if (a.story_id !== b.story_id) return 0;
        return a.order_index - b.order_index;
      });
      renderChaptersTable();
      document.getElementById('chapter-form').style.display = 'none';
    };

    function editChapter(id) {
      const chapter = chapters.find(x => x.id === id);
      if (!chapter) return;
      updateStorySelect();
      document.getElementById('chapter-editor-container').innerHTML = ''; // Clear
      initEditor('chapter-editor-container', chapter.content); // Init with content
      document.getElementById('chapter-form').style.display = 'block';
      document.getElementById('chapter-form-title').innerText = 'Chỉnh sửa chương';
      document.getElementById('chapter-id').value = chapter.id;
      document.getElementById('chapter-story').value = chapter.story_id;
      document.getElementById('chapter-title').value = chapter.title;
      document.getElementById('chapter-slug').value = chapter.slug;
      document.getElementById('chapter-content').value = chapter.content;
      document.getElementById('chapter-order').value = chapter.order_index;
      currentChapterId = chapter.id;
    }

    function deleteChapter(id) {
      if (confirm(`Xóa chương ID ${id}?`)) {
        chapters = chapters.filter(ch => ch.id !== id);
        alert('Xóa thành công!');
        renderChaptersTable();
      }
    }

    // Auto slug for chapters
    document.getElementById('chapter-title').addEventListener('input', function() {
      document.getElementById('chapter-slug').value = slugify(this.value);
    });

    renderChaptersTable();

    // ========== COMMENTS (FULL) ==========
    let comments = [
      { id: 1, post_id: 1, guest_name: 'User A', guest_email: 'a@example.com', content: 'Bình luận hay!', parent_id: null, avatar_color: '#3b82f6', status: 'pending', created_at: new Date().toISOString() },
      { id: 2, post_id: 1, guest_name: 'User B', guest_email: 'b@example.com', content: 'Trả lời bình luận trên.', parent_id: 1, avatar_color: '#10b981', status: 'approved', created_at: new Date().toISOString() },
      { id: 3, post_id: 2, guest_name: 'Guest C', guest_email: 'c@example.com', content: 'Câu hỏi về bài viết.', parent_id: null, avatar_color: null, status: 'rejected', created_at: new Date().toISOString() }
    ];
    const commentsTable = document.getElementById('comments-table');

    function renderCommentsTable() {
      commentsTable.innerHTML = '';
      comments.forEach(com => {
        const row = document.createElement('tr');
        const postTitle = fullPosts.find(p => p.id === com.post_id)?.title || 'Unknown Post';
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

    renderCommentsTable();

    // ========== PASSWORD RESETS ==========
    let passwordResets = [];
    const passwordResetsTable = document.getElementById('password-resets-table');

    function renderPasswordResetsTable() {
      passwordResetsTable.innerHTML = '';
      passwordResets.forEach(pr => {
        const row = document.createElement('tr');
        const userName = users.find(u => u.id === pr.user_id)?.name || 'Unknown';
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

    renderPasswordResetsTable();

    // ========== COMMENTS ACTIONS (STATS) ==========
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

    // ========== FOOTER ==========
    // --- Data ---
    let copyright = { id: 1, copyright_text: "© 2025 WeCook. All rights reserved.", updated_at: new Date().toISOString().slice(0,19).replace('T',' ') };
    let socials = [];
    let socialId = 1;
    let editingSocialId = null;

    // --- CRUD Footer ---
    function loadFooterForm() {
      document.getElementById('copyright-text').value = copyright.copyright_text;
      document.getElementById('current-copyright').textContent = copyright.copyright_text;
      renderSocials();
      clearSocialForm();
    }

    document.getElementById('save-copyright').onclick = () => {
      const text = document.getElementById('copyright-text').value.trim();
      if (!text) return alert("Nhập text bản quyền!");
      copyright.copyright_text = text;
      copyright.updated_at = new Date().toISOString().slice(0,19).replace('T',' ');
      document.getElementById('current-copyright').textContent = text;
      alert("Đã lưu bản quyền!");
    };

    const socialTable = document.getElementById('social-table');
    document.getElementById('add-social').onclick = () => {
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
        document.getElementById('add-social').textContent = 'Thêm Social';
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
    };

    function editSocial(id) {
      const soc = socials.find(s => s.id === id);
      if (!soc) return;
      editingSocialId = id;
      document.getElementById('add-social').textContent = 'Cập nhật Social';
      document.getElementById('social-url').value = soc.url;
      document.getElementById('social-order').value = soc.sort_order;
      document.getElementById('social-status').value = soc.status;
      // Note: For icon, since it's file, we can't prefill, but show current path
      document.getElementById('social-icon-label').textContent = `Chọn Icon SVG (Hiện tại: ${soc.icon_path})`;
    }

    function renderSocials() {
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
          document.getElementById('add-social').textContent = 'Thêm Social';
          clearSocialForm();
        }
      }
    }
    function clearSocialForm() {
      document.getElementById('social-icon').value = '';
      document.getElementById('social-url').value = '';
      document.getElementById('social-order').value = '';
      document.getElementById('social-status').value = 'active';
      document.getElementById('social-icon-label').textContent = 'Chọn Icon SVG';
    }

    // Helper functions
    function updateAuthorSelects() {
      updateAuthorSelect();
    }

    function updateCategorySelectHelper() {
      updateCategorySelect();
    }

    // Initial updates
    updateAuthorSelect();
    updateCategorySelect();
    updateStorySelect();
