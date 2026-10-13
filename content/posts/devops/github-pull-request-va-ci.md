# Buổi 2 — GitHub, Pull Request và CI

## Mục tiêu đã thực hành
- Đưa dự án lên GitHub.
- Tạo nhánh và mở Pull Request.
- Cho GitHub Actions tự chạy test.
- Quan sát CI xanh → đỏ → xanh khi làm sai rồi sửa test.

## Các khái niệm cần nhớ
- **Repository:** nơi lưu code và lịch sử thay đổi.
- **Commit:** lưu một phiên bản thay đổi trong Git.
- **Branch:** nhánh để làm thay đổi riêng.
- **Push:** đưa commit từ máy lên GitHub.
- **Pull Request (PR):** đề nghị merge thay đổi từ nhánh này vào nhánh khác.
- **Merge:** kết hợp thay đổi vào nhánh đích.
- **CI:** tự động kiểm tra code mỗi khi có thay đổi.
- **Workflow:** cấu hình tự động hóa trong `.github/workflows/`.
- **Runner:** máy thực hiện workflow; độc lập với máy mình.

## Pipeline hiện tại làm gì?
1. Lấy code từ repository.
2. Chuẩn bị Python.
3. Cài thư viện từ `requirements.txt`.
4. Chạy `python -m pytest -q`.

Máy GitHub không dùng `.venv` trên máy mình. Vì vậy cần khai báo
thư viện trong `requirements.txt`.

## Đọc file ci.yml
- `name`: tên workflow.
- `on`: sự kiện kích hoạt.
- `push`: chạy khi đẩy code.
- `pull_request`: chạy khi mở hoặc cập nhật PR.
- `permissions`: quyền workflow được sử dụng.
- `jobs`: các công việc.
- `runs-on`: môi trường chạy job.
- `steps`: các bước trong job.
- `uses`: sử dụng action có sẵn.
- `run`: chạy lệnh terminal.

YAML dùng thụt dòng để biểu diễn cấu trúc. Dùng dấu cách, tránh Tab.

## Quy trình làm tính năng mới
Sau khi PR đã merge trên GitHub, cập nhật nhánh chính ở máy:

```powershell
git switch main
git pull origin main
```

Tạo nhánh mới, ví dụ:

```powershell
git switch -c feature/add-security-scan
```

Sau khi sửa code, kiểm tra và lưu thay đổi:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
git status
git diff
git add TEN_FILE
git commit -m "Describe the change"
git push -u origin feature/add-security-scan
```

Thay `TEN_FILE` bằng file muốn đưa vào commit.
Sau đó mở PR trên GitHub, đọc kết quả CI rồi merge khi phù hợp.

## Khi CI đỏ
1. Vào GitHub → Actions → chọn lần chạy bị lỗi.
2. Mở job và step màu đỏ.
3. Đọc thông báo lỗi.
4. Sửa code hoặc cấu hình trên máy.
5. Chạy test tại máy, commit rồi push lại.

Push vào nhánh đang có PR sẽ cập nhật PR đó; không cần mở PR mới.

## Bài thử xanh → đỏ → xanh
- `/health` trả về HTTP 200.
- Test mong đợi 200 → đạt.
- Đổi test sang mong đợi 201 → thất bại.
- Sửa lại 200 → đạt.

Bài này chứng minh CI phát hiện được test thất bại.

## Những điều dễ quên
- CI xanh chỉ nghĩa là các kiểm tra đã cấu hình đều đạt.
- CI xanh chưa chứng minh ứng dụng không có lỗ hổng.
- CI đỏ chưa tự chặn merge nếu chưa cấu hình bảo vệ nhánh.
- Không đưa `.venv`, `.env` hoặc secret thật lên GitHub.
- `NOTES.md` nằm trong `.gitignore` nên ghi chú mới không được push.

## Tự kiểm tra hiểu bài
- Commit khác push ở đâu?
- Vì sao cần làm trên branch và mở PR?
- GitHub cài thư viện bằng cách nào?
- Khi CI đỏ, mình xem lỗi ở đâu?
- Vì sao CI xanh chưa đủ để kết luận code an toàn?

## Buổi tiếp theo
Tích hợp công cụ quét bảo mật đầu tiên vào CI, đọc cảnh báo
và lưu kết quả quét để sau này AI Agent sử dụng.