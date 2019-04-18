Người thực hiện: **Trần Kiến Quốc (Domain: quoctk)** <br/><br/>

Nội dung báo cáo: <br/>
1. Định lý CAP và khái niệm **eventual consistency** là gì?<br/>
    * CAP là viết tắt của 3 từ: Consistency, Availability và Partition Tolerance.<br/>
        - <em>Consistency (Tính nhất quán)<em/>: Các sự kiện đọc đều nhận được kết quả mới nhất của sự kiện ghi gần nhất.
        - *Availability (Tính sẵn sàng)*: Mọi request đều nhận được response (không nhất thiết phải đảm bảo dữ liệu nhận được là phiên bản mới nhất).
        - *Partition Tolerance (Tính chịu đựng phân mảnh)*: Trạng thái hoạt động của hệ thống khi đường mạng giữa các node bị đứt.
        - *Ví dụ trường hợp có CP nhưng không có A*:
        - *Ví dụ trường hợp có AP nhưng không có C*:
        - *Ví dụ trường hợp có CA nhưng không có P*:
    * Eventual consistency (Nhất quán đến cuối cùng): 
        - *Cách hiểu*: Sau khi một cập nhật được diễn ra, các lần đọc sau đó không đảm bảo sẽ luôn trả về giá trị mới được cập nhật (có thể có lần đọc vẫn trả về dữ liệu cũ). Tuy nhiên sau một khoảng thời gian (đồng bộ giữa các CSDL) thì cuối cùng các lần đọc đều trả về giá trị mới nhất.
        - *Ví dụ*: Mỗi tối thứ 2 Quốc hoàn thành một bài tập và sao chép bài vào USB. Mỗi tối thứ 3 Ngọc qua nhà Quốc để lấy USB về và sử dụng "ké" kết quả bài tập của Quốc (USB chứa nội dung bài tập mới nhất). Tuy nhiên, vào hôm thứ 5 Quốc mở bài ra kiểm tra lại và thấy bài làm của mình có chỗ sai nên đã sửa lại. Lúc này, nội dung bài tập trong USB của Ngọc đã "lỗi thời" (dữ liệu cũ), và để nhận được nội dung mới (bài tập đã sửa) lẫn kết quả bài tập tuần kế tiếp thì Ngọc phải trả USB cho Q vào tối chủ nhật rồi đợi đến tối thứ 3 để nhận USB sau khi Q sao chép bài mới nhất (Gồm bài tập đã sửa và bài tập mới).
2. Khái niệm **throughput (thông lượng)** và **latency (độ trễ)** là gì?
    * *Throughput (Thông lượng)*:
    * *Latency (Độ trễ)*:




<br/><br/>
Nguồn tham khảo:
1. https://github.com/nesso99/system-design-beginner#relational-database-management-system-rdbms
2. https://viblo.asia/p/shard-database-voi-activerecord-turntable-l0rvmx3kGyqA
3. https://kipalog.com/posts/Cau-chuyen-nhung-nha-tham-hiem-va-nguyen-ly-C-A-P-cua-he-phan-tan