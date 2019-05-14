            # LINUX SYSTEM PROGRAMMING

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

## FILE & FILE SYSTEM

1. **Khái niệm file descriptor:**
   * **Everything is a file** là một trong những triết lý của HĐH Linux, nghĩa là mọi thứ trong hệ thống đều được quy tụ về dạng file, như các thao tác nhập xuất, network socket, library files, file thực thi chương trình, .txt,... đều là file, và file được hiểu như là một khối thông tin tùy ý hoặc là tài nguyên để lưu trữ thông tin. HĐH Linux có các loại file bên dưới:

        | KÝ HIỆU | LOẠI FILE                   |
        | :-:     | ---                         |
        | -       | File thường (Regular file)  |
        | d       | Đường dẫn (directory)       |
        | c       | Character device file       |
        | b       | Block device file           |
        | s       | Domain socket               |
        | p       | Pipe                        |
        | l       | Symbolic link               |
    * **File descriptor (FD)** là một công cụ dùng để quản lý các sự kiện liên quan đến file và chứa các số nguyên dương đại diện cho các file này. Mỗi một process có một bảng FD riêng do kernel quản lý, kernel sẽ chuyển danh sách này sang ***file table (FT)*** (bất kì process nào cũng có thể truy vào) nhằm xác định chế độ mà file đó đang được sử dụng (Đọc, ghi, chèn). Sau đó, FT sẽ được mapping qua một bảng thứ 3 là ***inode table (IT)*** , bảng này quản lý thật sự các file bên dưới bộ nhớ. Khi một tiến trình muốn đọc hoặc ghi file, tiến trình này sẽ chuyển file descriptor cho kernel xử lý (bằng các lệnh system call) và kernel sẽ truy cập file này thay cho process. Process không thể truy cập trực tiếp các file hoặc inode table. Ngoài ra, khi ta mở hoặc tạo một file, kernel sẽ trả về giá trị file descriptor cho process tương ứng. Khi ta đóng file đó lại thì file descriptor này sẽ được giải phóng để cấp phát cho những lần mở file sau.

        ![File-Descriptor-Image](images/1.png)

2. **Khái niệm Regular files:**
   * **RF:** Là loại file được lưu trữ trong hệ thống file và hầu hết các file này được sử dụng trực tiếp bởi chúng ta, chẳng hạn như: .txt, image, exe,... Nếu đọc/ghi dữ liệu từ file thường, kernel sẽ tuân thủ theo quy tắc của hệ thống file mà xử lý, nên đôi khi việc đọc/ghi này có thể bị trì hoãn do các trường hợp đặc-biệt-khác-xen-vào.

3. **Khái niệm Special files:**
   * **SF:** Là loại file được lưu trữ trong hệ thống file và loại này đôi khi được gọi là "device file". Khi ghi dữ liệu vào file này, các thao tác dường như diễn ra ngay lập tức mà không tuân theo các quy tắc hệ thống file thông thường. Các file này thể hiện giao diện (interface) của các thiết bị driver (trình điều khiển thiết bị) trong hệ thống file như thể đó là file thông thường.
   * Ví dụ như `/dev/null`, đây không phải là file thông thường mà nó là interface. Ta có thể thực hiện nhiều thao tác trên các file kiểu như vậy. File đặc biệt này như một "lỗ đen" của máy tính, thu nhận mọi thứ ta gửi đến nhưng không gửi trả cái gì, ứng dụng rộng rãi cũng như bảo mật (Các gói tin "sai trái" thì firewall có thể chuyển vào đây).
   * Trong Linux có 2 loại SF là "block special files" và "character special files". 
     * Block special files: Bất kì thiết bị nào cũng thể hiện dữ liệu I/O ở đơn vị là *block*.2
     * Character special files:2 Bất kì thiết bị nào cũng thế hiện dữ liệu I/O ở đơn vị là *kí tự* (1 b2yte mỗi lần).

<br/><br/>

## PROCESS

1. **Khái niệm Process trong HĐH:**


2. **Memory Layout:**
   * **Khái niệm ML:**
   * **Stack:**
   * **Heap:**
   * **Data Segment:**
   * **Text Segment:**

<br/><br/>

## THREAD

1. **Khái niệm:**
   * **Thread:**
   * **POSIX Thread:**
   * **Các API trong POSIX:**
   * **Race condition:**
   * **Deadlock:**
   * **Phương pháp ngăn chặn Race Condition:**
   * **Phương pháp ngăn chặn Deadlock:**

2. **Multi-Threading:**
   * **Khái niệm:**
   * **Các vấn đề thường gặp:**




<br/><br/>

## SYNCHRONIZATION

1. **Khái niệm Semaphore và so sánh Semaphore với Mutex:**
   * **Semaphore:**
   * **So sánh Semaphore với Mutex:**


2. **Reader Writer Program:**
   * aaa




<br/><br/>

## NETWORKING

1. **NonBlocking I/O:**
   * aaa

2. **Blocking I/O:**
   * aaa








<br/><br/>

## NGUỒN THAM KHẢO

1. https://cloudcraft.info/huong-dan-cau-hinh-max-file-descriptor/ 
2. https://vimentor.com/vi/lesson/gioi-thieu-ve-file-i-o
3. https://www.computerhope.com/jargon/r/regular-file.htm
4. https://www.computerhope.com/jargon/s/special-file.htm
5. https://forum.gocit.vn/threads/tim-hiu-v-dev-null.424/