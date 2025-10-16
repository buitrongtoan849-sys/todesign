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

// Editor functions
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
    const hiddenEl = document.getElementById(hiddenId);
    if (hiddenEl) hiddenEl.value = content;
    return content;
  }
  return '';
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