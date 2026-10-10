# Vòng lặp trong JavaScript — bài test cập nhật lần 2

Đây là bài mẫu thứ hai để kiểm tra bản sửa cache của blog Cốt Dừa. Nếu bạn thấy bài này sau khi tải lại bình thường, danh mục đã nhận được nội dung mới.

## Lặp lại một công việc với for

Thay vì viết ba lệnh gần giống nhau, mình có thể dùng vòng lặp để in các số từ 1 đến 3:

```javascript
for (let so = 1; so <= 3; so++) {
  console.log(`Lần thử thứ ${so}`);
}
```

Biến `so` bắt đầu từ 1. Mỗi lượt, JavaScript kiểm tra điều kiện `so <= 3`, chạy phần thân rồi tăng `so` thêm 1. Khi điều kiện không còn đúng, vòng lặp dừng lại.

## Duyệt danh sách với for...of

Khi chỉ cần lấy từng giá trị trong mảng, `for...of` giúp ví dụ dễ đọc hơn:

```javascript
const viecCanLam = ["Viết bài", "Kiểm tra ví dụ", "Đăng blog"];

for (const viec of viecCanLam) {
  console.log(`Cốt Dừa sẽ: ${viec}`);
}
```

> [!NOTE]
> Luôn kiểm tra điều kiện dừng khi viết vòng lặp. Với ví dụ đếm số, quên tăng biến đếm có thể khiến vòng lặp chạy mãi và làm tab bị treo.

## Tự thử

Đổi giới hạn của vòng lặp đầu tiên từ 3 thành 5, rồi thêm một việc mới vào mảng. Chạy lại trong Console để xem kết quả thay đổi thế nào.

Bài này là nội dung mẫu phục vụ kiểm tra cập nhật, bạn có thể sửa hoặc bỏ khỏi danh mục khi thử xong.
