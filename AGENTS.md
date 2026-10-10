# Quy định dự án Blog cá nhân / Ghi chú học tập

## Mục tiêu

- Xây dựng blog cá nhân để chia sẻ ghi chú học tập, trải nghiệm khi học kiến thức mới và những bài viết cảm nghĩ của tác giả.
- Viết lại kiến thức theo cách hiểu của bản thân, kết hợp ví dụ, trải nghiệm thực tế và bài học rút ra để người khác đọc và thấy hữu ích.
- Ưu tiên trải nghiệm đọc: nội dung dễ tìm, chữ dễ đọc, bố cục rõ ràng và hiển thị tốt trên điện thoại.
- MVP tập trung vào danh sách bài viết và trang đọc bài. Tính năng theo dõi khóa học hoặc tiến độ học tập chỉ thêm khi người dùng yêu cầu.
- Ưu tiên MVP đơn giản, dễ sử dụng và dễ bảo trì; mở rộng theo từng tính năng nhỏ.

## Kiến trúc và triển khai

- 100% client-side: toàn bộ giao diện và logic chạy trong trình duyệt.
- Không xây dựng server, backend, API riêng hoặc cơ sở dữ liệu phía server.
- Triển khai miễn phí trên GitHub Pages dưới dạng website tĩnh.
- Các đường dẫn tài nguyên và điều hướng phải tương thích với GitHub Pages, kể cả khi website nằm dưới đường dẫn repository.

## Công nghệ

- Ưu tiên HTML, CSS hiện đại và JavaScript thuần.
- Có thể sử dụng Tailwind CSS qua CDN nếu phù hợp.
- Chỉ sử dụng React/Vite khi cần cấu trúc component; hỏi người dùng trước khi chuyển từ cấu trúc hiện có sang React/Vite.
- Hạn chế thư viện và công cụ không cần thiết; chọn giải pháp đơn giản nhất đáp ứng tính năng.

## Lưu trữ và sao lưu dữ liệu

- Nội dung bài viết công khai phải được lưu thành tài nguyên tĩnh trong dự án và triển khai cùng website trên GitHub Pages để mọi người có thể đọc.
- LocalStorage chỉ lưu dữ liệu riêng trên trình duyệt như bản nháp hoặc tùy chọn đọc nếu có các tính năng này; dữ liệu đó không tự xuất hiện trên trình duyệt của người khác.
- Không xây dựng backend để lưu hoặc xuất bản bài viết. Nếu cần bổ sung quy trình soạn thảo và xuất bản, hỏi người dùng trước khi thay đổi cấu trúc lớn.
- Không tự động gửi bản nháp hoặc dữ liệu riêng trên trình duyệt lên dịch vụ bên ngoài.
- Có tính năng Export/Import file JSON để sao lưu và khôi phục dữ liệu được lưu trong LocalStorage; thao tác Import không đồng nghĩa với xuất bản bài viết công khai.
- Kiểm tra định dạng và tính hợp lệ của dữ liệu trước khi Import; không ghi đè dữ liệu hiện có khi file không hợp lệ.
- Nếu Import thay thế dữ liệu hiện có, yêu cầu người dùng xác nhận trước khi ghi đè.
- Xử lý lỗi đọc/ghi LocalStorage và thông báo rõ ràng bằng tiếng Việt.

## Quy trình phát triển

- Làm từng tính năng nhỏ, hoàn thiện MVP trước khi thêm tính năng nâng cao.
- Giữ phạm vi thay đổi tập trung vào yêu cầu hiện tại, tránh thêm chức năng chưa được yêu cầu.
- Viết code gọn gàng, tên biến và hàm rõ nghĩa, tách logic hợp lý và tránh lặp code.
- Viết comment bằng tiếng Việt cho logic quan trọng hoặc khó hiểu; không comment những đoạn code đã tự giải thích rõ.
- Hỏi lại người dùng trước khi thay đổi cấu trúc lớn, kiến trúc, công nghệ chính hoặc mô hình lưu trữ dữ liệu.
- Kiểm tra chức năng vừa thay đổi, khả năng giữ dữ liệu sau khi tải lại trang và giao diện trên màn hình điện thoại khi có liên quan.
- Với thay đổi liên quan đến lưu trữ, kiểm tra cả Export/Import JSON và trường hợp dữ liệu không hợp lệ.
- Khi hoàn thành, tóm tắt ngắn gọn những gì đã thay đổi, cách đã kiểm tra và hạn chế còn tồn tại nếu có.
