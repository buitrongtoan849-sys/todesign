<?php
// =====================================
// 🔧 CẤU HÌNH KẾT NỐI DATABASE (MySQLi)
// =====================================

// Thông tin kết nối
$host     = 'localhost';   // Máy chủ MySQL (mặc định: localhost)
$user     = 'root';        // Tên người dùng MySQL (mặc định trong XAMPP: root)
$password = '';            // Mật khẩu MySQL (mặc định: trống)
$database = 'todesign';    // Tên cơ sở dữ liệu bạn đã tạo trong phpMyAdmin

// Tạo kết nối MySQLi
$conn = mysqli_connect($host, $user, $password, $database);

// Kiểm tra kết nối
if (!$conn) {
    die("❌ Kết nối database thất bại: " . mysqli_connect_error());
}

// Thiết lập bảng mã UTF-8 để tránh lỗi tiếng Việt
mysqli_set_charset($conn, 'utf8mb4');

// =====================================
// 🌍 CẤU HÌNH CHUNG TOÀN TRANG
// =====================================

// Múi giờ Việt Nam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Đường dẫn gốc của website
define('BASE_URL', 'http://localhost/todesign/');

// Tên website
define('SITE_NAME', 'ToDesign');

// ✅ Thông báo kết nối thành công (chỉ dùng khi test)
# echo "✅ Đã kết nối MySQL thành công!";
