# LINUX PROGRAMMING

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

<br/>

## BÀI TẬP 3-2

#### 1. MÔ TẢ BÀI TẬP
Viết chương trình C mô phỏng lại lệnh `ls -l` và chạy thử trên Terminal.

#### 2. HƯỚNG DẪN

Tải file `3-2.c` về máy (HĐH Linux) và dịch chuyển (cd) vào trong thư mục chứa file c.

Thực hiện lệnh bên dưới để biên dịch chương trình c
```
gcc -o 3-2 3-2.c
chmod a+x 3-2
```

Sau khi biên dịch, bạn sẽ nhận được file chạy chương trình `3-2`.

Bạn dịch chuyển (cd) đến thư mục bất kì mà bạn muốn test chương trình và sử dụng lệnh bên dưới để chạy chương trình.
```
<Đường dẫn đến thư mục chứa file đã biên dịch>/3-2
```

Ví dụ: **/home/cpu11817/ZalopayFresher/02-linux-thinking/02-linux-programming/BaiTap/BT3-2/**`3-2`


Như vậy, bạn sẽ nhận được kết quả giống như lệnh "ls -l" của hệ thống, có điều cách bố trí và màu sắc của chương trình C sẽ khác tí tẹo so với lệnh hệ thống ^^!

![3.2-Demo-Image](./images/1.jpg)

*(Ảnh minh họa demo chương trình)*

***Lưu ý:*** 
* Bạn nhớ kiểm tra máy tính của bạn đã có gcc hay chưa, nếu chưa thì hãy cài đặt nó nhé. 
* Tham khảo cách cài đặt gcc và biên dịch chương trình trên các hệ điều hành (HĐH) khác nhau [Tại đây.](https://www3.ntu.edu.sg/home/ehchua/programming/cpp/gcc_make.html?fbclid=IwAR2rFyspsCxLTxxsgeY2AcsVirWPhE_eXZPUlK_PAbtrQ0bOOmkhlRoOI6o)

<br/><br/>

## BÀI TẬP 3-3

#### 1. MÔ TẢ BÀI TẬP

![3.3-Requirement](./images/2.jpg)

#### 2. MÔ TẢ Ý TƯỞNG VỀ BÀI TẬP

* Server sẽ nhập vào số client được phép kết nối, trong đoạn [3,9]. Ở phía client, mỗi người phải nhập cho mình một cái tên, tên đó không được trùng với các "command tín hiệu" (Tên được kiểm tra âm thầm và báo kết quả vì sao không hợp lệ cho client nếu client nhập phải, chứ không liệt kê ra các vấn đề nhằm tránh tò mò) và tên được xóa toàn bộ khoảng cách. Tên này được dùng để lưu file cũng như là xếp thứ hạng.
* Mảng bi có kích cỡ random trong đoạn [101,999] và giá trị của mỗi phần từ là random trong đoạn [1,1000], thực hiện ở phía server.
* Server chỉ chạy và game chỉ bắt đầu khi số client đã đủ. Các bên kết nối với nhau, riêng server sau khi đủ số lượng, sẽ tiến hành tạo ra số luồng tương ứng số lượng client.
* Client muốn lấy bi từ server sẽ phải gửi command "ClientRequestMarble" đến server, server nhận command và nếu còn bi, sẽ gửi bi về. Khi server hết bi thì server sẽ gửi giá trị "-1" đến client để client dừng lấy bi.
* Trong quá trình lấy bi, client vừa sort lại mảng giá trị vừa viết kết quả vào file. Có vẻ tốn tài nguyên nhưng như vậy sẽ tốt hơn, bởi nếu như giữa chừng hệ thống có trục trặc, chí ít còn file lưu kết quả đến thời điểm bị lỗi gần nhất và dùng file đó để xử lý tiếp.
* Client gửi tên người chơi lên server để server lưu kết quả cũng như tạo file (Nếu client có file). Nếu server nhận được, server sẽ phản hồi về cho client dưới command "ServerReceivedPlayerName". Sau đó, client gửi tiếp command "ClientDontHaveMarble" (Client không có viên bi nào) hoặc "ClientReadyToSendFile" (Client có bi, có file và sẵn sàng gửi). Server kiểm tra lại command đó, nếu client nào không có bi thì server lưu lại tên, kết quả (tổng bi bằng 0) và thoát khỏi hàm nhận file từ client. Ngược lại, client có bi thì server sẽ tiến hành nhận dữ liệu từ client thông qua command "ServerRequestDataOfFile" đến khi client gửi hết dữ liệu. Kế tiếp, server tính sum và lưu lại tên, tổng kết quả bi vào mảng vector. Đặc biệt, khi client nào gửi xong file qua server nhanh thì sẽ xuống hàm nhận file ranking từ server và đứng đó đợi command "ServerSendRankingFile" từ server.
* Server đóng toàn bộ luồng, tiến hành sort thứ hạng và lưu kết quả xuống file "ranking.txt". Sau đó, server gửi lệnh "ServerSendRankingFile" đến client để client biết mà ngưng chờ, 2 bên bắt đầu việc gửi file ranking (server) và nhận file ranking (client). Hơn hết, ở đây chỉ cần dùng vòng lặp for để quét toàn mảng chứa các id socket nhằm gửi dữ liệu, không nhất thiết tạo luồng nữa.
* Client viết kết quả xuống file `<playername>_ranking.txt` và in kết quả lên màn hình.
* Server đóng toàn bộ socket và 2 bên dừng trò chơi.

#### 3. HƯỚNG DẪN

Tải 2 thư mục là `_client` và `_server` về máy (HĐH Linux).

* Biên dịch file client.cpp:
  * Dịch chuyển (cd) vào trong thư mục `_client`.
  * Thực hiện lệnh bên dưới để biên dịch chương trình client.cpp ra file `client`
    ```
    g++ -o client client.cpp -std=c++11 -lpthread
    ```
* Biên dịch file server.cpp:
  * Dịch chuyển (cd) vào trong thư mục `_server`.
  * Thực hiện lệnh bên dưới để biên dịch chương trình server.cpp ra file `server`
    ```
    g++ -o server server.cpp -std=c++11 -lpthread
    ```
* Chú thích:
  * -std=c++11: Biên dịch với phiên bản C++11.
  * -lpthread: Link thư viện pthread vào chương trình bởi Linker. Còn include bên trong file cpp chỉ cho compiler biết là thư viện nào đang cần.

Sau khi biên dịch, bạn sẽ nhận được 2 file chạy chương trình là `client` và `server`.

Mở 4 đến 10 Terminal, trong đó có 1 Terminal làm server, 3 đến 9 Terminal làm Client.

Khởi động server
```
Dịch chuyển (cd) đến thư mục chứa file vừa biên dịch (server)
./server
```

Khởi động client
```
Dịch chuyển (cd) đến thư mục chứa file vừa biên dịch (client)
./client
```

Phía server, ta phải nhập số client được phép kết nối. 

Phía client, ta phải nhập tên cho mỗi người.

Sau khi các client đã được nhập xong hết tên, trò chơi sẽ được bắt đầu. Sau đó, phía server có kết quả lấy bi của các client cũng như bảng xếp hạng, phía client (mỗi người chơi) sẽ có kết quả lấy bi cũng như bảng xếp hạng cho riêng mình.

Video demo cho 9 client tham gia cùng một lúc, truy cập vào `"/video-demo/video-demo-9-clients.mp4"`