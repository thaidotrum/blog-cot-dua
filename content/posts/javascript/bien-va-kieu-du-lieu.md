# Ghi chú về biến và kiểu dữ liệu

Sau khi in được lời chào đầu tiên, mình bắt đầu đặt câu hỏi: chương trình giữ tên, số lượng hay trạng thái bằng cách nào? Biến giúp mình đặt tên cho những giá trị đó và sử dụng lại trong code.

## Khi nào dùng const, khi nào dùng let?

Mình thường bắt đầu với `const` khi không cần gán lại biến. Khi giá trị cần được thay bằng một giá trị khác, mình dùng `let`.

```javascript
const tenKhoaHoc = "JavaScript cơ bản";
let soBaiDaDoc = 1;

// Gán lại số bài sau khi đọc thêm một bài.
soBaiDaDoc = soBaiDaDoc + 1;

console.log(tenKhoaHoc);
console.log(soBaiDaDoc); // 2
```

`const` ngăn việc gán lại biến; nó không làm cho mọi dữ liệu bên trong object hoặc array trở nên bất biến. Mình sẽ quay lại chi tiết này khi học về object.

## Ba kiểu dữ liệu dễ gặp

- **String:** chuỗi ký tự, ví dụ `"JavaScript cơ bản"`.
- **Number:** giá trị số, ví dụ `2` hoặc `3.5`.
- **Boolean:** giá trị `true` hoặc `false`, dùng để biểu diễn một điều kiện.

```javascript
const ten = "An";
const soBai = 2;
const daBatDau = true;

console.log(typeof ten);      // "string"
console.log(typeof soBai);    // "number"
console.log(typeof daBatDau); // "boolean"
```

> [!NOTE]
> Mình từng nhầm số `2` với chuỗi `"2"`. Thử `typeof` và quan sát kết quả giúp mình kiểm tra giả định trước khi sửa code.

## Tự thử một chút

Hãy tạo một biến chứa chủ đề bạn đang học và một biến chứa số phút bạn muốn dành cho nó hôm nay. In cả hai ra Console, rồi thử thay đổi số phút bằng `let`.

Với mình, nhớ cú pháp chỉ là bước đầu. Tự đặt một ví dụ gần với việc học của bản thân mới giúp kiến thức ở lại lâu hơn.
