# DATA ALGO THINKING

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

<br/>

## BÀI TẬP 3-1

#### 1. MÔ TẢ BÀI TẬP
* Bài tập sử dụng IDE Eclipse và ngôn ngữ Java để thực hiện.
* Trên ứng dụng có một thanh search, khi user gõ kí tự nào thì ứng dụng sẽ liệt kê ra danh sách gợi ý các từ. Nếu user chọn từ và enter tìm kiếm, ứng dụng sẽ kiểm tra xem từ đó có tồn tại hay không và gửi trả thông báo cho user.
* Ứng dụng kiểm tra từ tồn tại bằng 2 phương pháp, vòng lặp For và Đệ quy. Đồng thời, ứng dụng kết hợp hàm random để ngẫu nhiên phương pháp nào sẽ chạy khi kiểm tra từ.
* Ứng dụng sử dụng 2 pattern chính yếu, đó là Singleton pattern và Strategy pattern.
    * Singleton được sử dụng nhằm mục đích, một chương trình xuyên suốt chỉ có duy nhất 1 thể hiện (1 biến cho tất cả).
    * Strategy được sử dụng nhằm mục đích, mở rộng các hàm tìm kiếm (nghĩa là viết nhiều cách tìm kiếm khác nhau). Tại đây có 2 hàm tìm kiếm implements lại interface SearchMethods.
* Ứng dụng lưu trữ cũng như xử lý dữ liệu theo phương pháp TrieNode, Trie.

#### 2. HƯỚNG DẪN
Tải project folder `PredictiveText` từ đường dẫn `/BT3-1/PredictiveText` về máy.

Sau đó, tải tập dữ liệu về máy tính theo các bước bên dưới

* Bước 1: Truy cập link [blogs.zip](http://u.cs.biu.ac.il/~koppel/BlogCorpus.htm) và tải tập dữ liệu về.
* Bước 2: Giải nén file và đổi tên folder thành `dataset`.
* Bước 3: Đưa folder `dataset` vào bên trong folder `src`. Đường dẫn là `/BT3-1/PredictiveText/src/dataset`.

Import project `PredictiveText` vào eclipse và bấm tổ hợp phím `Alt + Shift + X` rồi chọn `J (Run java application)` để chạy chương trình. Như vậy là xong.

***Lưu ý:***
* Sau khi chạy chương trình, tùy vào thông số máy tính mà thời gian ứng dụng hiển thị sẽ khác nhau. Với máy tính của mình, thời gian ứng dụng hiển thị là tầm 15 đến 20 phút. Vì sao lâu thế? Vì folder `dataset` quá nhiều file dữ liệu, đọc và xử lý chúng sẽ mất rất nhiều thời gian.
* Mình không tạo sẵn cho các bạn file `.exe` hay `.jar` được vì nó nặng quá. Xin lỗi các bạn nhiều!!!
* Bên trong các file source code mình đều có chú thích, giới thiệu từng hàm, bạn hãy mở ra xem nhé.

#### 3. BENCHMARK HÀM KIỂM TRA TỪ TỒN TẠI
```
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
NOTHING HEREEEEEE
```

<br/>

## BÀI TẬP 3-2

#### 1. MÔ TẢ BÀI TẬP
* Bài tập được tham khảo nội từ [repo này](https://github.com/jamesroutley/write-a-hash-table).
* Bài tập được xây dựng thủ công hoàn toàn về Hash Table.
* Bài tập cho phép user sử dụng một trong 3 cách giải quyết đụng độ (Linear Probing, Quadratic Probing và Double Probing) ngay tại khởi tạo biến.
* 3 cách giải quyết đụng độ implements lại interface HashMethods.
* Kích cỡ của Hash Table luôn là số nguyên tố, kích cỡ nhỏ nhất là 5 phần tử. Dù user có khởi tạo Hash Table với kích cỡ tùy ý (kích cỡ đó không phải là số nguyên tố) thì kích cỡ thực sự của Hash Table sẽ là số nguyên tố gần nhất với số tùy ý của user.
* Một vài phương thức tiêu biểu của Hash Table tự cài đặt này:
    ```
    ===>HÀM PUBLIC<===
    new HashTable()
    new HashTable(int size)
    new HashTable(int size, double loadfactor)
    new HashTable(int size, HashMethods<K,V> hashmethod)
    new HashTable(int size, double loadfactor, HashMethods<K,V> hashmethod)
    ht_put(K key, V value)
    ht_get(K key)
    ht_delete(K key)
    ht_isEmpty()
    ht_size()
    ht_numElements()
    Object[] ht_keySet()

    ===>HÀM PRIVATE<===
    HashTable<K,V> ht_newSize(int basesize)
    ht_resizeTable(int basesize)
    ht_resizeUp()
    ht_resizeDown()
    ```
* Cách gọi 3 phương thức giải quyết đụng độ implements lại interface HashMethods:
    ```
    HashMethods<K,V> hm = new DoubleHashing<K,V>()
    HashMethods<K,V> hm = new LinearHashing<K,V>()
    HashMethods<K,V> hm = new QuadraticHashing<K,V>()
    ```

#### 2. HƯỚNG DẪN
Tải project folder `HashTable` từ đường dẫn `/BT3-2/HashTable` về máy.

Import project `HashTable` vào eclipse và bấm tổ hợp phím `Alt + Shift + X` rồi chọn `J (Run java application)` để chạy chương trình. Như vậy là xong.

***Lưu ý:***
* Bên trong các file source code mình đều có chú thích, giới thiệu từng hàm, bạn hãy mở ra xem nhé.

<br/>

## BÀI TẬP 3-3



