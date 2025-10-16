let contacts = [
  { id: 1, user_id: null, name: 'Nguyễn Văn A', email: 'a@example.com', message: 'Tôi có câu hỏi về sản phẩm.', created_at: new Date().toISOString() },
  { id: 2, user_id: 2, name: 'John Doe', email: 'john@example.com', message: 'Gợi ý cải thiện website.', created_at: new Date().toISOString() }
];

window.contacts = contacts;
window.users = window.users || []; // Depend on users

function initContacts() {
  renderContactsTable();
}

function renderContactsTable() {
  const contactsTable = document.getElementById('contacts-table');
  if (!contactsTable) return;
  contactsTable.innerHTML = '';
  contacts.forEach(c => {
    const row = document.createElement('tr');
    const createdDate = new Date(c.created_at).toLocaleDateString('vi-VN');
    const userName = c.user_id ? window.users.find(u => u.id === c.user_id)?.name || 'Unknown' : 'Guest';
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
    hideContactDetails();
  }
}

window.initContacts = initContacts;