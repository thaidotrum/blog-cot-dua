# Hiểu về hàm trong Kotlin qua hình minh họa

Bài này là một ví dụ về cách trình bày ghi chú có nhiều ảnh: mỗi hình nằm ngay sau phần giải thích liên quan, kèm chú thích ngắn. Sáu hình minh họa do mình cung cấp được đặt xen giữa nội dung và code để bạn có thể đọc theo từng ý.

## 1. Nhìn hàm như một chiếc hộp

Mình thích bắt đầu bằng hình dung đơn giản: hàm là một khối code có tên, có thể nhận dữ liệu đầu vào và thực hiện một công việc. Bên trong chiếc hộp là phần thân hàm — nơi viết các bước xử lý.

![Sơ đồ hàm nhận inputs, có tên name và phần xử lý body](assets/images/kotlin/function-overview.png "Hình 1. Dữ liệu đầu vào đi vào hàm; phần thân chứa các bước xử lý.")

Khi gọi hàm, mình dùng tên của nó và truyền các giá trị cần thiết. Một hàm cũng có thể không cần đầu vào, như ví dụ `main()` ở dưới.

## 2. Tên hàm cho biết công việc

Trong Kotlin, một khai báo hàm bắt đầu bằng từ khóa `fun`. Tiếp theo là tên hàm, danh sách tham số trong dấu ngoặc tròn và phần thân trong dấu ngoặc nhọn.

![Cấu trúc fun name(inputs) với tên hàm được tô màu xanh lá](assets/images/kotlin/function-name.png "Hình 2. Tên hàm giúp người đọc nhận ra công việc mà hàm thực hiện.")

Mình thường chọn tên diễn tả một hành động, như `printFullName` hoặc `addOne`. Tên rõ ràng giúp mình hiểu lại code sau một thời gian không mở nó.

## 3. Đầu vào giúp dùng lại hàm

Thay vì viết một hàm riêng cho từng giá trị, mình dùng tham số để cùng một hàm làm việc với nhiều dữ liệu khác nhau.

![Cấu trúc hàm Kotlin với phần inputs được tô màu xanh lá](assets/images/kotlin/function-inputs.png "Hình 3. Tham số là nơi khai báo dữ liệu mà hàm nhận vào.")

Ví dụ, một hàm in họ tên có thể nhận hai tham số kiểu `String`:

```kotlin
fun printFullName(firstName: String, lastName: String) {
    println("$firstName $lastName")
}
```

![Hai đầu vào firstName và lastName đi vào hàm printFullName để in họ tên](assets/images/kotlin/print-full-name.png "Hình 4. Hai giá trị đầu vào được dùng trong thân hàm để in họ tên.")

Khi gọi `printFullName("An", "Nguyen")`, hàm in ra `An Nguyen`. Lần sau, mình có thể truyền một tên khác mà không viết lại phần xử lý.

> [!NOTE]
> Với mình, hình minh họa giúp nhìn được luồng dữ liệu. Sau đó, mình gõ và chạy lại ví dụ để kiểm tra xem cách hiểu của mình có khớp với kết quả hay không.

## 4. Một hàm có thể trả về kết quả

Hàm `printFullName` thực hiện việc in ra màn hình. Còn `addOne` dưới đây tính và trả về một số để mình sử dụng tiếp.

![Số number đi vào hàm addOne và được cộng thêm một](assets/images/kotlin/add-one.png "Hình 5. Hàm addOne nhận một số và tính giá trị number + 1.")

```kotlin
fun addOne(number: Int): Int {
    return number + 1
}

fun main() {
    val result = addOne(4)
    println(result) // 5
}
```

Mình phân biệt hai việc: `return` đưa kết quả về nơi gọi hàm, còn `println` hiển thị một giá trị ra màn hình.

## 5. Ghép các phần trong main()

Quay lại ví dụ lời chào, mình có thể nhận ra ba phần: tên hàm là `main`, dấu ngoặc tròn không có tham số và phần thân chứa lệnh in.

![Hàm main với các mũi tên chỉ tên hàm, danh sách tham số rỗng và thân hàm println](assets/images/kotlin/main-function.png "Hình 6. Áp dụng cấu trúc tên, đầu vào và thân hàm vào ví dụ main().")

```kotlin
fun main() {
    println("Hello, world!")
}
```

Sau khi đọc, bạn có thể thử viết một hàm nhận tên của mình và in lời chào. Một ví dụ nhỏ do mình tự đặt sẽ giúp những sơ đồ này trở thành kiến thức mình thực sự dùng được.
