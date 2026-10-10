# Mình hiểu if else trong JavaScript như thế nào

Lúc mới học JavaScript, mình muốn trang web phản hồi khác nhau tùy vào điều người dùng nhập. Ví dụ: nhập đúng mật khẩu thì hiện lời chào, nhập sai thì báo thử lại.

Từ đó, mình bắt đầu tìm hiểu `if else`: cách để chương trình lựa chọn việc cần làm dựa trên một điều kiện.

## Hiểu đơn giản về if else

Mình hình dung nó giống một quyết định hằng ngày:

- Nếu trời mưa, mình mang áo mưa.
- Nếu không, mình đi như bình thường.

Trong JavaScript, mình có thể viết như này:

```javascript
const troiMua = true;

if (troiMua) {
  console.log("Nhớ mang áo mưa nhé!");
} else {
  console.log("Hôm nay không cần áo mưa.");
}
```

Điều kiện đúng thì chạy phần trong `if`. Điều kiện sai thì chạy phần trong `else`.

## Thử với nhiều trường hợp hơn

Nếu có nhiều khả năng, mình dùng thêm `else if`.

```javascript
const diem = 7;

if (diem >= 8) {
  console.log("Bạn làm tốt lắm!");
} else if (diem >= 5) {
  console.log("Bạn đã đạt, tiếp tục luyện tập nhé!");
} else {
  console.log("Mình cùng ôn lại kiến thức nha.");
}
```

Với `diem = 7`, chương trình sẽ in:

```text
Bạn đã đạt, tiếp tục luyện tập nhé!
```

JavaScript kiểm tra các điều kiện từ trên xuống. Khi gặp điều kiện đúng, nó chạy nhánh đó và bỏ qua những nhánh còn lại.

## Một lỗi mình dễ mắc

Ban đầu, mình dễ nhầm giữa dấu `=` và `===`:

- `=` dùng để gán giá trị.
- `===` dùng để so sánh giá trị và kiểu dữ liệu.

```javascript
const ten = "Cốt Dừa";

if (ten === "Cốt Dừa") {
  console.log("Chào Cốt Dừa!");
}
```

> [!NOTE]
> Khi điều kiện không chạy như mong đợi, mình thường dùng `console.log()` để kiểm tra giá trị của biến trước. Cách này giúp mình hiểu lỗi thay vì sửa theo cảm giác.

## Bạn thử thay đổi một chút nhé

Quay lại ví dụ điểm số, thử lần lượt đổi `diem` thành:

- `9`
- `5`
- `3`

Trước khi chạy code, hãy đoán xem chương trình sẽ in câu nào. Mình thấy việc tự đoán rồi kiểm tra giúp nhớ lâu hơn chỉ đọc ví dụ.

## Điều mình rút ra

`if else` giúp chương trình đưa ra lựa chọn. Phần mình cần luyện thêm là viết điều kiện rõ ràng và đặt các nhánh theo thứ tự hợp lý.

Mình bắt đầu từ những ví dụ nhỏ như trên, rồi mới thử áp dụng vào nút bấm hoặc form nhập liệu.