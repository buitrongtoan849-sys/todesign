
  (function () {
    document.addEventListener('click', function (e) {
      const toggle = e.target.closest('.dropdown__toggle');
      const item = e.target.closest('.dropdown__item');
      const drop = e.target.closest('.dropdown');

      // Nếu bấm vào toggle => toggle open/close
      if (toggle) {
        const root = toggle.closest('.dropdown');
        // close other dropdowns first
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== root) {
            d.classList.remove('open');
            // reset scroll of closed ones immediately
            const inner = d.querySelector('.dropdown__menu-inner');
            if (inner) inner.scrollTop = 0;
          }
        });

        // toggle this one
        root.classList.toggle('open');

        // nếu mở thì đảm bảo menu-inner lăn về đầu — dùng requestAnimationFrame/timeout để đợi browser apply class
        if (root.classList.contains('open')) {
          const menuInner = root.querySelector('.dropdown__menu-inner');
          if (menuInner) {
            // small delay so animation starts, then smooth-scroll to top for nicer effect
            requestAnimationFrame(() => {
              // nếu muốn smooth:
              try {
                menuInner.scrollTo({ top: 0, behavior: 'smooth' });
              } catch (err) {
                // fallback
                menuInner.scrollTop = 0;
              }
            });
          }
        }
        return; // xử lý xong toggle
      }

      // Nếu bấm vào 1 item trong menu
      if (item) {
        const root = item.closest('.dropdown');
        const menuInner = root.querySelector('.dropdown__menu-inner');

        // nếu item có link điều hướng (href khác '#') thì trang sẽ chuyển; nếu không, chúng ta đóng dropdown
        // Đóng dropdown ngay
        root.classList.remove('open');

        // reset scroll ngay lập tức để lần mở sau nó luôn ở đầu
        if (menuInner) menuInner.scrollTop = 0;

        // Nếu bạn muốn preventDefault (ví dụ href="#" không chuyển trang) uncomment dưới đây:
        // e.preventDefault();

        return;
      }

      // Click ra ngoài: đóng tất cả
      if (!drop) {
        document.querySelectorAll('.dropdown.open').forEach(d => {
          d.classList.remove('open');
          const inner = d.querySelector('.dropdown__menu-inner');
          if (inner) inner.scrollTop = 0;
        });
      }
    });
  })();

