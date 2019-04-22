## SYSTEM THINKING (QuocTK)<br/>

### Nội dung báo cáo:
1. Định lý CAP và khái niệm eventual consistency là gì?
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

2. Khái niệm throughput (thông lượng) và latency (độ trễ) là gì?
    * Throughput (Thông lượng): Lượng hành động/kết quả đưa ra/nhận được trong một đơn vị thời gian.
    * Latency (Độ trễ): Lượng thời gian (chờ) để tạo ra một kết quả nào đó.
    * Ví dụ: 
        - Lượng nước chảy qua ống có đường kính khác nhau gọi là Thông lượng.
        - Khoảng thời gian cần thiết để lượng nước từ đầu này sang đầu kia hoàn tất gọi là Độ trễ. <br/><br/>
        ![Alt](images/1.jpg "Example throughput & latency") <br/>

3. Task Queue khác gì Message Queue?
    * MQ: Dùng cơ chế truyền message (message passing) khi nào message tới thì nó nhận, giữ và xử lý.
    * TQ: Dùng theo cơ chế quản lý Task - có nghĩa là khi có yêu cầu đến, thì nó đẩy vào Task Queue nhưng không xử lý liền, mà xác định một thời gian, nó tạo plan để sắp xếp các task nào cùng nghiệp vụ hoặc có tính chất tuần tự nhau, hoặc giống nhau thì mới chạy theo lịch thực thi này. TQ cũng nhận, giữ, xử lý và chuyển đi các kết quả, song là phù hợp với các công việc đòi hỏi tính toán nặng.

4. Các phương pháp để scale database (MySQL):
    * Master-slave replication: Server master phục vụ việc đọc và ghi, nhân bản các dữ liệu được ghi ra slave (nơi dữ liệu chỉ đọc), và slave có thể nhân bản ra các slave khác. Nếu master sập, hệ thống sẽ ở trạng thái chỉ đọc cho đến khi một slave nào đó được đưa lên làm master hoặc master được tu sửa.
        - Ưu: Master sập thì người dùng vẫn xem được dữ liệu.
        - Nhược: Cần cơ chế để đưa slave lên master.
    * Master-master replication: Có 2 hoặc nhiều master, tất cả đều hỗ trợ đọc ghi, các server là ngang hàng về việc ghi. Nếu một master sập, hệ thống vẫn tiếp tục đọc ghi trên các master khác.
        - Ưu: Tất cả đều hỗ trợ đọc và ghi, một master sập thì master khác vẫn hoạt động.
        - Nhược:<br/>
            ~ Cần một load balancer để điều phối hoặc cần thay đổi logic để quyết định ghi vào/đọc từ master nào.<br/>
            ~ Nếu thêm master thì độ phức tạp khi xung đột sẽ tăng lên (Ghi vào đâu, đọc ở đâu, chia như thế nào...)<br/>
            ~ Tính nhất quán giữa các master không cao và việc đồng bộ giữa các master cũng góp phần tăng độ trễ.
    * Federation: Chia CSDL bằng hàm. Thay vì sử dụng một CSDL đơn (chứa rất nhiều bảng và data) thì ta tách nó ra thành các CSDL riêng biệt, như: accounts, orders và products. Nếu như cần đọc ghi gì thì đi đến đúng CSDL đó, giúp giảm tải cho việc chỉ sử dụng một CSDL.
        - Ưu:<br/>
            ~ Chia tách nên CSDL sẽ nhỏ, ít traffic đọc, ghi cho mỗi database và giảm 'lag'.<br/>
            ~ CSDL nhỏ nên tiết kiệm dung lượng bộ nhớ, cải thiện thông lượng cũng như có thể đọc ghi song song.
        - Nhược: <br/>
            ~ Các CSDL tách rời nhau nên kết hợp bảng lại sẽ phức tạp.<br/>
            ~ Cần cài đặt các logic để xác định việc ghi & đọc ở trên CSDL nào.<br/>
            ~ Nếu một lược đồ  chứa nhiều thuộc tính và bảng chứa dữ liệu quá lớn, lại nằm trên một CSDL nào đó thì phương pháp này trở nên kém hiệu quả.
    * Sharding: Là một tiến trình lưu giữ các bản ghi dữ liệu qua nhiều thiết bị để đáp ứng yêu cầu về sự gia tăng dữ liệu. Khi kích cỡ của dữ liệu tăng lên, một thiết bị đơn ( 1 database hay 1 bảng) không thể đủ để lưu giữ dữ liệu. Sharding giải quyết vấn đề này với việc mở rộng phạm vi theo bề ngang (horizontal scaling). Với Sharding, bạn bổ sung thêm nhiều thiết bị để hỗ trợ cho việc gia tăng dữ liệu và các yêu cầu của các hoạt động đọc và ghi. Ví dụ, chia nhỏ bảng hoặc CSDL ra thành các phần khác nhau, chúng có cấu trúc dữ liệu giống nhau nhưng lưu các dữ liệu khác nhau để giảm tải thay cho việc chỉ dùng 1 bảng.
        - Ưu: <br/>
            ~ Kích cỡ các CSDL gọn nhẹ sau tách, hiệu năng tăng và truy vấn nhanh hơn.<br/>
            ~ Nếu một sharp sập thì vẫn còn sharp khác họat động.<br/>
            ~ Việc đọc và ghi dễ dàng diễn ra song song.
        - Nhược:<br/>
            ~ Cần phải có logic để điều phối việc đọc ghi trên sharp nào.<br/>
            ~ Dữ liệu có thể bị "nhồi" ở một sharp nào đó, tức là có sharp sẽ nhận được nhiều request trong khi có sharp "rảnh rỗi".<br/>
            ~ Việc kết hợp các sharp lại với nhau cũng khó khăn, tốn kém.
    <br/><br/>![Alt](images/2.jpg "shardingDB") <br/>

5. Khái niệm về Load balancer và lí do NGINX dùng single thread:
    * Load balancer:

    * NGINX dùng single thread:






<br/><br/>
### Nguồn tham khảo:
1. https://github.com/nesso99/system-design-beginner#relational-database-management-system-rdbms
2. https://viblo.asia/p/shard-database-voi-activerecord-turntable-l0rvmx3kGyqA
3. https://kipalog.com/posts/Cau-chuyen-nhung-nha-tham-hiem-va-nguyen-ly-C-A-P-cua-he-phan-tan
4. http://paginaswebpublicidad.com/questions/23227/su-khac-biet-giua-do-tre-bang-thong-va-thong-luong-la-gi
5. https://www.manifold.co/blog/introduction-to-message-queuing-and-rabbitmq-6cb8e6e9b2
6. https://blog.imaginea.com/scale-part-i-task-queues/

