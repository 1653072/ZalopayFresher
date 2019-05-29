# LINUX SHELL

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

<br/>

## HIỂU BIẾT CƠ BẢN

### GREP

Cú pháp: `grep [options] [pattern] [file]`

```
## Grep: Tìm kiếm chuỗi và in những dòng chứa nội dung khớp với mẫu dữ liệu ta nhập vào. Bắt đầu với dòng đầu tiên trong file, grep sẽ copy dòng đó vào buffer và so sánh nó với chuỗi tìm kiếm, nếu thỏa thì in dòng đó ra màn hình.

## Pattern là các biểu thức chính quy (regular expression). Biểu thức chính quy là một chuỗi các ký tự được sử dụng để chỉ định quy tắc khớp mẫu. Các ký tự đặc biệt được sử dụng để xác định các quy tắc và vị trí phù hợp.

## Options:
-i: thực hiện tìm kiếm không phân biệt chữ hoa chữ thường.
-n: hiển thị các dòng chứa mẫu cùng với số dòng.
-v: hiển thị các dòng không chứa mẫu đã chỉ định.
-c: hiển thị số lượng các mẫu phù hợp.
```

### SED

Cú pháp chính:
``
sed 's/pattern/replace_string/' file
``

Hoặc
``
cat file | sed 's/pattern/replace_string/'
``

```
## Sed: Tìm kiếm, lọc, thay thế và thao tác văn bản như chèn, tìm kiếm xóa,.... Sed là một trong những tiện ích mạnh mẽ được cung cấp bởi các hệ thống Linux/Unix và chúng ta có thể sử dụng sed với các biểu thức chính quy.

## Giải thích pattern: Có thể là chuỗi ký tự hoặc 1 biểu thức chính quy. Trong 1 văn bản, chuỗi cần thay thế (pattern) có thể xuất hiện từ 0 đến nhiều lần, mỗi lần như vậy được gọi là 1 xuất hiện của chuỗi cần thay thế.
```

Mặc định, sed chỉ in ra các văn bản được thay thế. Để lưu các thay đổi này vào cùng 1 tập tin, sử dụng tùy chọn **`-i`**.
```
sed -i 's/text/replace/' file
```

Nếu chúng ta sử dụng các cú pháp đã đề cập ở trên, sed sẽ thay thế sự xuất hiện đầu tiên của mẫu (pattern) trong mỗi dòng. Nếu chúng ta muốn thay thế tất cả xuất hiện của mẫu trong văn bản, chúng ta cần thêm tham số **`g`** vào cuối.

Hậu tố **`/g`** có nghĩa là nó sẽ thay thế các xuất hiện của mẫu cho đến cuối văn bản, mặc định nó sẽ bắt đầu với xuất hiện thứ 1 của mẫu.
```
sed 's/pattern/replace_string/g' file
```

Thay thế từ xuất hiện thứ N của mẫu cho đến cuối văn bản. Để làm việc này, chúng ta có thể sử dụng dạng **`/Ng`**.
```
echo thisthisthisthis | sed 's/this/THIS/2g'
Kết quả: thisTHISTHISTHIS
```

Xóa các dòng trống là 1 kỹ thuật đơn giản với việc sử dụng sed. Các khoảng trống có thể được đối chiếu với biểu thức chính quy ^$
```
sed '/^$/d' file
```

Thông thường để kết hợp nhiều lệnh sed với nhau, chúng ta thường sử dụng toán tử **`pipe (|)`**.
```
sed 'expression' | sed 'expression'
Hoặc
sed 'expression; expression'
Hoặc
sed -e 'expression' -e 'expression'
```

Xem thêm các cách sử dụng khác [tại đây](http://www.justpassion.net/tech/programming/bash-shell/lenh-sed-trong-linux.html).

### FIND

Cú pháp cơ bản:
``
find [starting-point] [options] [expression]
``

```
## Find: Mục đích là tìm kiếm các file trong đó thỏa điều kiện mình đề ra.

## Một số loại file descriptors:
    f - File thông thường
    d - Thư mục
    l - Symbolic link
    c - Character devices
    b - Block devices

## In kết quả ra file (-type f) có tên là conf_search.
find /etc -type f -name “*.conf” > conf_search

## Tìm file theo kích cỡ. Chẳng hạn tìm các file có kích cỡ từ 1000MB trở lên
find / -size +1000MB
```

### AWK

```
## Awk: Là ngôn ngữ lập trình có mục đích đặc biệt được thiết kế để xử lý văn bản và thường được sử dụng như công cụ phân tích, báo cáo và trích xuất dữ liệu.

## Ví dụ mã lệnh:
awk '/localhost/{print}' /etc/hosts
awk '/[0-9]/{print}' /etc/hosts
```

Cú pháp: `awk 'script' filenames`

Nội dung của script: `/pattern/ { actions }`. Script có thể là các biểu thức chính quy, nhưng nó cũng có thể là một mẫu đặc biệt BEGIN và END.
```
BEGIN { actions } 
/pattern/ { actions }
/pattern/ { actions }
...
END { actions } 

## Giải thích:

Awk sẽ thực thi (các) hành động được chỉ định trong BEGIN một lần trước khi thực thi (các) những hành động kế tiếp "/pattern/ { actions }.

Awk sẽ thực thi (các) hành động được chỉ định trong END trước khi nó thực sự thoát.
```

<br/>

## PROCESSING TEXTS

1. Count the number of lines satisfying a specific pattern in a log file

    Mở terminal, cd đến thư mục chứa logfile. Sau đó gõ lệnh theo bên dưới để đếm số dòng chứa mẫu mà mình đang cần đếm.
    ```
    grep -c <pattern> <filename> 

    VÍ DỤ: grep -c EEEE logfile
    ```
    
    Với câu hỏi này, vì có **-c** nên sẽ chuyển sang in giá trị đã đếm được (c: count).

2. Calculate KLOC of code C/C++ files in a directory

    Sử dụng file `bash/3-1-2.sh` để tính KLOC của các file có đuôi `.c`, `.cpp`, `.h` bằng cách:
    ```
    Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
    chmod +x 3-1-2.sh
    ./3-1-2.sh
    ```
    
    Bạn có thể mở file để xem source code cũng như các dòng chú thích (giải thích) ngay trong file.

<br/>

## SYSTEM

1. Kill multiple processes following a patterns (using awk, grep, xargs).
   
    Ta có thể dùng lệnh bên dưới để kết thúc tất cả tiến trình với mẫu tên ta cho sẵn
    ```
    ps -ef | grep 'name' | grep -v grep | awk '{print $2}' | xargs -r kill -9
    ```

    CHÚ THÍCH: 
     * `ps-ef:` Liệt kê tất cả các tiến trình đang chạy.
     * `grep 'name':` Lọc tất cả tiến trình chứa tên là *name*.
     * `awk '{print $2}':` In các PID (Các PID nằm ở cột thứ 2 trong danh sách tiến trình)
     * `grep -v grep:` Danh sách tiến trình có hiển thị lại grep 'name', cho nên dòng này cần được loại bỏ bằng grep -v grep.
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

    #### CHÚ THÍCH cho netstat:
    * netstat (network statistics): Hiển thị các kết nối mạng cho TCP/UDP (incoming và outgoing), bảng định tuyến, số lượng network interface và số lượng thống kê network protocol.
    * -a: Liệt kê tất cả các các cổng kết nối TCP và UDP
    * -t: Liệt kê các cổng kết nối kiểu TCP.
    * -u: Liệt kê các cổng kết nối kiểu UDP.
    * -l: Liệt kê tất cả các cổng kết nối đang hoạt động, lắng nghe.
    * -p: Liệt kê mã ID của tiến trình.

    #### CHÚ THÍCH về fuser:
    * fuser: Tìm quá trình nào đang sử dụng tệp, thư mục, socket. Song, là hiển thị các thông tin khác liên quan đến người dùng đang sở hữu tiến trình đó và loại quyền truy cập.
    * -k: Nghĩa là "kill", kết thúc các tiến trình thuộc protocol TCP hoặc UDP tại một port nào đó.

3. List opennned ports, handles.

    Sử dụng lệnh bên dưới để liệt kê tất cả các port đang được mở
    ```
    sudo netstat -tulap
    ```

4. Find files via regular expressions, and remove them.

    Tìm file và xóa dựa trên REGEX theo mẫu bên dưới
    ```
    find your-directory/ -regex '[regex]' -delete

    VÍ DỤ: find environments/linuxshell/testdel/ -regex '.*cpp' -delete
    ```

    CHÚ THÍCH:
    * `.*cpp`: Tất cả file với tên bất kì nhưng phải chứa cpp ở cuối tên.
    * `-regex`: Sử dụng "regular expression". Xem thêm hướng dẫn sử dụng [tại đây.](http://www.grymoire.com/Unix/Regular.html)
    * `find <path/folder>`: Tìm đến thư mục nào đó, kiếm các file trong đó thỏa điều kiện mình đề ra (file phải tồn tại) và xóa chúng.

5. List, one at a time, all files larger than 100K in the /home/username directory tree. Give the user the option to delete or compress the file, then proceed to show the next one. Write to a logfile the names of all deleted files and the deletion times.

    Sử dụng file `bash/3-2-5.sh` để liệt kê các file có kích cỡ lớn hơn 100KB ở thư mục /home/username. Khi khởi chạy file bash này, user sẽ có 3 sự lựa chọn:
    * 0: Dừng hẳn chương trình.
    * 1: Thực hiện xóa một file do user nhập.
      * Kết quả xóa file được lưu theo dòng `<date-time>: <deletedfile>` vào cuối file `deletedfilelog.txt` tại thư mục /home/username.
    * 2: Thực hiện nén một file do user nhập.
      * Kết quả là file bình thường được nén thành file `<filename>-<date>-<time>.zip` tại thư mục /home/username/CompressFolder.

    Hướng dẫn chạy chương trình:
    ```
    Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
    Mở file & sửa đổi lại HOMEPATH theo đúng /home/username của máy bạn
    chmod +x 3-2-5.sh
    ./3-2-5.sh
    ```

<br/>

## SHELL SCRIPTING

### CÁCH 1
* Sử dụng file `bash/3-3.sh` để tính tổng các giá trị là `số nguyên dương` trong file đã cho. 
   ```
   Tải file về máy, dịch chuyển (cd) vào thư mục chứa file
   Mở file & sửa đổi lại HOMEPATH theo đúng /home/username của máy bạn
   chmod +x 3-3.sh
   ./3-3.sh
   Nhập tên file.
   ```

* Để test kết quả, hãy tải về máy 3 file là `data/sample.data`, `data/sample02.data` và `data/sample03.data`. Kết quả lần lượt khi chạy của 3 file là
   * `data/sample.data`: 1249992
   * `data/sample02.data`: 2334
   * `data/sample03.data`: 210

* Bạn có thể mở file để xem source code cũng như các dòng chú thích.

### CÁCH 2
* Một cách đơn giản hơn nhưng cực mạnh mẽ, dùng lệnh bên dưới ngay trên Terminal. Hoặc để cho dễ dàng hơn, bạn có thể để lệnh này vào bash script và chạy script đó.
    ```
    Tải các file sampledata về máy, dịch chuyển (cd) vào thư mục chứa file
    awk '{sum+=$1} END {print "Sum of numbers: " sum}' sample02.data
    ```

* Như vậy là bạn đã có được giá trị sum một cách thật đơn giản. Với cách 2 này, file dữ liệu mẫu của bạn cũng phải chứa `số nguyên dương` như cách 1.

* Chú thích:
   * sum+=$1: Các con số sẽ được nạp vào $1 và thực hiện cộng dồn vào biến sum.
   * END {...}: Khi nào awk đọc & cộng dồn hết file, thì lệnh của END mới được chạy, ở đây là in kết quả sum.
   * `awk .... <filename>`: Thực hiện awk ngay trên file này.

<br/>

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