# LINUX SHELL

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

## PROCESSING TEXTS

1. Count the number of lines satisfying a specific pattern in a log file

    Mở terminal, cd đến thư mục chứa logfile. Sau đó gõ lệnh theo bên dưới để đếm số dòng chứa mẫu mà mình đang cần đếm.
    ```
    grep -c <pattern> <filename> 

    VÍ DỤ: grep -c EEEE logfile
    ```

    **grep `<pattern>`** In những dòng chứa nội dung khớp với mẫu dữ liệu ta nhập vào. Tuy nhiên, vì có **-c** nên sẽ chuyển sang đếm (count).

2. Calculate KLOC of code C/C++ files in a directory

    Sử dụng file `bash/3-1-2.sh` để tính KLOC của các file có đuôi .c .cpp .h bằng cách
    ```
    Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
    chmod +x 3-1-2.sh
    ./3-1-2.sh
    ```
    
    Bạn có thể mở file để xem source code cũng như các dòng chú thích.

<br/><br/>

## SYSTEM

1. Kill multiple processes following a patterns (using awk, grep, xargs).
   
    Ta có thể dùng lệnh bên dưới để kết thúc tất cả tiến trình với mẫu tên ta cho sẵn
    ```
    ps -ef | grep 'name' | grep -v grep | awk '{print $2}' | xargs -r kill -9
    ```

    Giải thích: 
     * `ps-ef:` Liệt kê tất cả các tiến trình đang chạy.
     * `grep 'name':` Lọc tất cả tiến trình chứa tên là *name*.
     * `awk '{print $2}':` In các PID (Các PID nằm ở cột thứ 2 trong danh sách tiến trình)
     * `grep -v grep:` Danh sách tiến trình có hiển thị grep 'name', cho nên dòng này cần được loại bỏ bằng grep -v grep.
     * `xargs -r kill -9:` Tạo ra một quy trình mới để gửi tất cả các PID đã lọc nhằm (kill -9) kết thúc tất cả.
     * `kill -9:` Khi sử dụng signal -9, quá trình đó sẽ không có cơ hội dọn dẹp "sạch sẽ chính bản thân mình" hoặc chưa kịp lưu lại trạng thái công việc của nó (Kết thúc một cách "bạo lực"). Sử dụng signal này như phương sách cuối cùng hoặc không muốn sử dụng các signal khác. 

2. Kill processes opening a specific port (using netstat, grep...).

    Liệt kê tất cả tiến trình đang chạy với các port
    ```
    sudo netstat -tulap
    ```

    Liệt kê tất cả tiến trình đang chạy với một port nhất định
    ```
    sudo netstat -tulnap | grep :[PORT]
    ```

    #### CÁCH 1:

    Xóa các tiến trình của port trên dựa trên PID
    ```
    sudo kill -9 PID

    VÍ DỤ: sudo kill -9 5353
    ```

    #### CÁCH 2:

    Ngắn gọn không kém phần mạnh mẽ. Xóa dựa trên port và kiểu protocol là TCP hoặc UDP.
    ```
    sudo fuser -k [PORT]/[TCP/UDP]

    VÍ DỤ: sudo fuser -k 7000/tcp
    ```

3. List opennned ports, handles.

    Sử dụng lệnh bên dưới để liệt kê tất cả các port đang được mở
    ```
    sudo netstat -tulap
    ```

    CHÚ THÍCH cho netstat:
    * -a: Liệt kê tất cả các các cổng kết nối TCP và UDP
    * -t: Liệt kê các cổng kết nối kiểu TCP.
    * -u: Liệt kê các cổng kết nối kiểu UDP.
    * -l: Liệt kê tất cả các cổng kết nối đang hoạt động, lắng nghe.
    * -p: Liệt kê mã ID của tiến trình.

4. Find files via regular expressions, and remove them.

    Tìm file và xóa dựa trên REGEX theo mẫu bên dưới
    ```
    find your-directory/ -regex '[regex]' -delete

    VÍ DỤ: find environments/linuxshell/testdel/ -regex '.*cpp' -delete
    (.*cpp nghĩa là tất cả file với tên bất kì nhưng phải chứa cpp ở cuối tên)
    ```

5. List, one at a time, all files larger than 100K in the /home/username directory tree. Give the user the option to delete or compress the file, then proceed to show the next one. Write to a logfile the names of all deleted files and the deletion times.

    Sử dụng file `bash/3-2-5.sh` để liệt kê các file có kích cỡ lớn hơn 100k ở thư mục /home/username. Khi khởi chạy file bash này, user sẽ có 3 sự lựa chọn:
    * 0: Dừng hẳn chương trình.
    * 1: Thực hiên xóa một file do user nhập.
      * Kết quả được lưu theo dòng `<date-time>: <deletedfile>` vào cuối file `deletedfilelog.txt` tại thư mục /home/username.
    * 2: Thực hiện nén một file do user nhập.
      * Kết quả là file bình thường được nén thành file `<filename>-<date>-<time>.zip` tại thư mục /home/username/CompressFolder.

    ```
    Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
    Mở file & sửa đổi lại HOMEPATH theo đúng /home/username của máy bạn
    chmod +x 3-2-5.sh
    ./3-2-5.sh
    ```
    
    Bạn có thể mở file để xem source code cũng như các dòng chú thích.

<br/><br/>

## SHELL SCRIPTING

1. CÁCH 1
    * Sử dụng file `bash/3-3.sh` để tính tổng các giá trị là `số nguyên dương` trong file đã cho. 
        ```
        Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
        Mở file & sửa đổi lại HOMEPATH theo đúng /home/username của máy bạn
        chmod +x 3-3.sh
        ./3-3.sh
        ```

    * Để test kết quả, hãy tải về máy 3 file là `data/sample.data`, `data/sample02.data` và `data/sample03.data`. Kết quả lần lượt khi chạy của 3 file là
      * `data/sample.data`: 1249992
      * `data/sample02.data`: 2334
      * `data/sample03.data`: 210

    * Bạn có thể mở file để xem source code cũng như các dòng chú thích.

2. CÁCH 2
   * Một cách đơn giản hơn nhưng cực mạnh mẽ
        ```
        Tải các file sampledata về máy, dịch chuyển (cd) vào thư mục chứa file
        awk '{sum+=$1} END {print "Sum of numbers: " sum}' sample02.data
        ```
   * Như vậy là bạn đã có được giá trị sum một cách thật đơn giản. Ngoài ra, với cách 2 này, file dữ liệu mẫu của bạn cũng phải chứa `số nguyên dương` như cách 1.

<br/><br/>

## THAM KHẢO:

1. https://stackoverflow.com/questions/37668111/what-does-wc-do-and-how-do-you-use-it-to-count-words-in-a-file
2. https://linuxconfig.org/bash-scripting-tutorial-for-beginners
3. https://unix.stackexchange.com/questions/163271/count-records-matching-pattern-with-awk
4. The-Linux-Command-Line-William-Shotts.pdf
5. https://stackoverflow.com/questions/29454101/unix-grep-command-grep-v-grep
6. https://stackoverflow.com/questions/8987037/how-to-kill-all-processes-with-a-given-partial-name
7. https://viblo.asia/p/hoc-regular-expression-va-cuoc-doi-ban-se-bot-kho-updated-v22-Az45bnoO5xY
8. https://stackoverflow.com/questions/11162406/open-and-write-data-to-text-file-using-bash
9. https://www.cyberciti.biz/faq/unix-howto-read-line-by-line-from-file/
10. https://ubuntuforums.org/showthread.php?t=677751
11. https://www.linuxquestions.org/questions/linux-newbie-8/bash-reading-values-numbers-from-a-file-and-storing-them-into-an-array-842293/