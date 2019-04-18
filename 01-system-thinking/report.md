## SYSTEM THINKING <br/>

**Người thực hiện**: Trần Kiến Quốc (Domain: quoctk) <br/>

**Nội dung báo cáo**:
1. Định lý CAP và khái niệm **eventual consistency** là gì?
    * CAP là viết tắt của 3 từ: Consistency, Availability và Partition Tolerance.
        - Consistency (Tính nhất quán): Các sự kiện đọc đều nhận được kết quả mới nhất của sự kiện ghi gần nhất.
        - Availability (Tính sẵn sàng): Mọi request đều nhận được response (không nhất thiết phải đảm bảo dữ liệu nhận được là phiên bản mới nhất).
        - Partition Tolerance (Tính chịu đựng phân mảnh): Trạng thái hoạt động của hệ thống khi đường mạng giữa các node bị đứt.
        - Ví dụ trường hợp có CP nhưng không có A: Website đọc báo đứt kết nối tới database nên những gì người dùng thấy được trên website ngay tại thời điểm đó đều là dữ liệu đã được cache trong RAM. Đồng thời, một vài node ở cuối mạng đã bị mất hoặc bị lỗi nên sẽ góp phần xảy ra tình huống này.
        - Ví dụ trường hợp có AP nhưng không có C: Có module đơn hàng và module quản lý tài khoản tiền của người dùng. Nếu bị đứt kết nối thì tiền có thể bị trừ mà đơn hàng vẫn chưa được submit thành công. Trong khi đó, các node vẫn hoạt động đều đều và xử lý các nghiệp vụ của từng module.
    * Eventual consistency (Nhất quán đến cuối cùng): 
        - Cách hiểu: Sau khi một cập nhật được diễn ra, các lần đọc sau đó không đảm bảo sẽ luôn trả về giá trị mới được cập nhật (có thể có lần đọc vẫn trả về dữ liệu cũ). Tuy nhiên sau một khoảng thời gian (đồng bộ giữa các CSDL) thì cuối cùng các lần đọc đều trả về giá trị mới nhất.
        - Ví dụ: Mỗi tối thứ 2 Quốc hoàn thành một bài tập và sao chép bài vào USB. Mỗi tối thứ 3 Ngọc qua nhà Quốc để lấy USB về và sử dụng "ké" kết quả bài tập của Quốc (USB chứa nội dung bài tập mới nhất). Tuy nhiên, vào hôm thứ 5 Quốc mở bài ra kiểm tra lại và thấy bài làm của mình có chỗ sai nên đã sửa lại. Lúc này, nội dung bài tập trong USB của Ngọc đã "lỗi thời" (dữ liệu cũ), và để nhận được nội dung mới (bài tập đã sửa) lẫn kết quả bài tập tuần kế tiếp thì Ngọc phải trả USB cho Q vào tối chủ nhật rồi đợi đến tối thứ 3 để nhận USB sau khi Q sao chép bài mới nhất (Gồm bài tập đã sửa và bài tập mới).
        - Kết luận: Độ chờ trễ không cao, kết quả nhận được tương đối nhanh nhưng có thể không phải là mới nhất.
2. Khái niệm **throughput (thông lượng)** và **latency (độ trễ)** là gì?
    <br/><br/>
    ![Alt](images/1.jpg "Example throughput & latency")
    <br/>
    * Throughput (Thông lượng): Lượng hành động/kết quả đưa ra/nhận được trong một đơn vị thời gian.
    * Latency (Độ trễ): Lượng thời gian (chờ) để tạo ra một kết quả nào đó.
    * Ví dụ cho bức hình trên: 
        - Lượng nước chảy qua ống có đường kính khác nhau gọi là Thông lượng.
        - Khoảng thời gian cần thiết để lượng nước từ đầu này sang đầu kia hoàn tất gọi là Độ trễ.

3. **Task Queue** khác gì **Message Queue**?
    * a



<br/><br/>
**Nguồn tham khảo**:
1. https://github.com/nesso99/system-design-beginner#relational-database-management-system-rdbms
2. https://viblo.asia/p/shard-database-voi-activerecord-turntable-l0rvmx3kGyqA
3. https://kipalog.com/posts/Cau-chuyen-nhung-nha-tham-hiem-va-nguyen-ly-C-A-P-cua-he-phan-tan
4. http://paginaswebpublicidad.com/questions/23227/su-khac-biet-giua-do-tre-bang-thong-va-thong-luong-la-gi
5. https://viblo.asia/p/shard-database-voi-activerecord-turntable-l0rvmx3kGyqA
