# Mảng trong JavaScript — bài mẫu để thử cập nhật

Đây là bài mẫu để thử quy trình đăng bài của blog Cốt Dừa. Sau khi GitHub Pages triển khai xong, tải lại trang Home để tìm bài này trong danh sách.

## Gom nhiều giá trị vào một danh sách

Mảng giúp lưu nhiều giá trị trong cùng một biến. Ví dụ, thay vì tạo từng biến riêng cho mỗi chủ đề, mình có thể viết một danh sách:

```javascript
const chuDe = ["Biến", "Hàm", "Mảng"];

// Chỉ số của phần tử đầu tiên là 0.
console.log(chuDe[0]); // Biến
console.log(chuDe.length); // 3
```

## Thêm một chủ đề rồi đọc từng phần tử

Phương thức `push()` thêm phần tử vào cuối mảng. Vòng lặp `for...of` giúp lấy lần lượt từng giá trị:

```javascript
const chuDe = ["Biến", "Hàm", "Mảng"];
chuDe.push("Vòng lặp");

for (const ten of chuDe) {
  console.log(`Cùng tìm hiểu: ${ten}`);
}
```

> [!NOTE]
> `const` ngăn gán lại biến sang một mảng khác, nhưng vẫn cho phép thay đổi nội dung mảng, chẳng hạn thêm phần tử bằng `push()`.

## Thử một chút

Bạn có thể thay danh sách trên bằng tên các cuốn sách muốn đọc. Thêm một cuốn mới và in danh sách ra Console để kiểm tra kết quả.

Bài này là nội dung mẫu phục vụ kiểm tra cập nhật. Bạn có thể sửa lại hoặc bỏ khỏi danh mục sau khi thử xong.
