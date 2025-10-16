// Navigation setup
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.sidebar a[data-section]');
  const content = document.getElementById('content');
  const logout = document.querySelector('.logout');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      loadSection(section);
    });
  });

  logout.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      window.location.href = '/login';
    }
  });

  // Load default section
  loadSection('stats');
});

async function loadSection(section) {
  try {
    const response = await fetch(`partials/${section}.html`);
    if (!response.ok) throw new Error('Failed to load section');
    const html = await response.text();
    document.getElementById('content').innerHTML = html;
    // Initialize section-specific logic
    const initFunc = window[`init${section.charAt(0).toUpperCase() + section.slice(1)}`];
    if (initFunc) {
      initFunc();
    }
  } catch (error) {
    console.error('Error loading section:', error);
    document.getElementById('content').innerHTML = '<h1>Error loading section</h1>';
  }
}