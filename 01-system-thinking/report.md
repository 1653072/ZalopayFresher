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

5. Khái niệm về Load balancer và NGINX:
    * Load balancer (LB): 
        - Cách hiểu: LB có nhiệm vụ phân tán các request đến các tài nguyên tính toán như các server hay CSDL mà chúng đang ổn định và ít "áp lực" hơn so với những server/CSDL còn lại. Về kết quả, LB đều trả về response từ tài nguyên tính toán đã nhận request đến client đã gửi request.
        - Lợi ích: <br/>
            ~ Tối đa hóa Uptime: LB giúp dàn trải lưu lượng truy cập và truy xuất giữa 2 hoặc nhiều máy chủ. Trường hợp máy chủ này lỗi thì LB sẽ phát hiện vấn đề và di chuyển lưu lượng truy cập đến các máy chủ online còn lại, nên dịch vụ cho người dùng sẽ không bị gián đoạn.<br/>
            ~ Dễ dàng thêm server/CSDL (Mở rộng hệ thống Datacenter): LB tự động điều phối giữa các máy chủ cũ và mới để tiếp tục xử lý các dịch vụ cũng như giảm tải trọng cho các máy chủ cũ.<br/>
            ~ Tăng cường bảo mật cho hệ thống Datacenter: Vì mọi yêu cầu hay trả lời đều thông qua LB nên ta có thể chặn người dùng giao tiếp trực tiếp với các máy chủ, ẩn đi các thông tin & cấu trúc mạng nội bộ, thậm chí có thể ngăn chặn các cuộc tấn công/truy cập trái phép.
        - Nhược điểm: <br/>
            ~ Mọi thứ đều đi qua LB, chỉ cần LB có vấn đề hoặc tài nguyên hoặc cấu hình của nó không tốt thì chẳng khác nào ta đang tự bóp cổ chính mình. <br/>
            ~ LB xử lý sẽ khá nhiều về req từ client cũng như res từ máy chủ nên có thể thể sẽ tăng sự phức tạp xử lý ở đây. <br/>
            ~ Dùng LB đơn lẻ thì không thể, nhưng nếu dùng nhiều LB thì dĩ nhiên sẽ tốt hơn, nhưng lại cấu hình phức tạp.
        - Có nhiều độ đo phổ biến để LB định tuyến traffic, nhưng có thể nói phổ biến nhất là Layer 4 và Layer 7: <br/>
            ~ Layer 4: Chuyển tiếp gói dữ liệu mạng đến và đi từ máy chủ upstream mà không kiểm tra nội dung của các gói dữ liệu. Có thể đưa ra quyết định định tuyến giới hạn bằng kiểm tra vài gói đầu tiên trong dòng TCP. Điểm trưng của Layer 4 là xử lý dữ liệu tìm thấy trong các giao thức tầng mang và vận chuyển (IP, TCP, FTP, UDP). <br/>
            ~ Layer 7: Hoạt động ở các lớp ứng dụng cao cấp, xử lý trực tiếp với nội dung thực tế của mỗi thư. HTTP là giao thức chủ yếu của layer 7 cho việc điều phôi lưu lượng truy cập trang web trên Internet. Nó có thể quyết định cân bằng tải dựa trên nội dung của thư (URL, cookie, hoặc message,...). Sau đó tạo mới một kết nối TCP mới đến máy chủ upstream đã chọn (hoặc tái sử dụng nếu sẵn có bằng phương pháp HTTP keepalives) và tạo ra yêu cầu đến máy chủ.
        <br/><br/>![Alt](images/3.png "Load Balancer") <br/>
    * NGINX:
        - Cách hiểu: Web server truyền thống tạo một thread cho mỗi yêu cầu (request). Trong khi đó, NGINX lại là một web server mạnh mẽ với cách thức hoạt động khác, cụ thể là sử dụng kiến trúc hướng sự kiện (event-driven), bất đồng bộ (asynchronous) và cho phép mở rộng tới hàng trăm nghìn kết nối đồng thời đến phần cứng/máy chủ. Ngoài ra, NGINX còn cung cấp nhiều tính năng nổi bật như Load balancer, HTTP caching, reverse proxy,...
        - Kiến trúc: NGINX có tiến trình cha và các tiến trình con, mà tiến trình con gồm các tiến trình xử lý (worker processes) cũng như các tiến trình trợ giúp (Ở hình dưới, Cache Manager và Cache Loader là 2 thành phần hỗ trợ). <br/>
            ~ Tiến trình cha Master process: Có nhiệm vụ là đọc cấu hình, liên kết các cổng với nhau. Sau đó tạo ra một vài tiến trình con để xử lý công việc. <br/>
            ~ Tiến trình hỗ trợ Cache Loader: Khi tiến trình con được khởi động thì Cache Loader sẽ chạy để tải "disk-based cache" vào bộ nhớ.<br/>
            ~ Tiến trình hỗ trợ Cache Manager: Chạy đình kỳ nhằm cắt bớt "entries" ít xài ở "disk cache" để duy trì kích cỡ cache đã được cấu hình.<br/>
            ~ Tiến trình xử lý Worker Processes: Làm mọi nhiệm vụ, xử lý mọi thứ, đảm bảo kết nối mạng được duy trì, đọc ghi lên đĩa cũng như giao tiếp với máy chủ. Mặc định thường có là 4 Worker Processes.
        <br/><br/>![Alt](images/4.png "NGINX Master processes and Child processes") <br/>
        - NGINX dùng đơn luồng: <br/>
            ~ Khi máy chủ NGINX hoạt động, chỉ các tiến trình xử lý (Worker Process) là bận, mỗi tiến trình xử lý sẽ xử lý nhiều kết nối theo kiểu không chặn (non-blocking) nhằm giảm số lần chuyển đổi ngữ cảnh. Ngoài ra, mỗi tiến trình xử lý là một luồng đơn và chạy độc lập nhau, cứ lấy các kết nối mới & xử lý chúng. Do vậy, điều này giúp hạn chế (hoặc tránh) các vấn đề về blocking hoặc context switching (chuyển đổi ngữ cảnh) mà chúng thường làm cho hệ thống trì trệ. <br/>
            ~ Ngược lại, cách tiếp cận process-per-connect hay thread-per-connection khi không nhận được sự kiện nào để xử lý, chúng sẽ bị block, đợi chờ và dẫn đến lãng phí tài nguyên hệ thống cho việc chuyển đổi ngữ cảnh. Suy ra, tiến trình xử lý (worker process) là luồng đơn, cứ "vào", nó xử lý, phản hồi và làm tiếp cái khác liên tục, không block và hạn chế nhất có thể việc chuyển đổi ngữ cảnh. <br/>
            ~ Giải thích về chuyển đổi ngữ cảnh: Việc điều phối các process sẽ bao gồm, việc ngừng process hiện tại lại, lưu lại trạng thái của process này, lựa chọn process tiếp theo sẽ được chạy, load trạng thái của process tiếp theo đó lên, rồi chạy tiếp process tiếp theo. Qúa trình này được gọi là chuyển đổi ngữ cảnh (context switch). Trong khi đó, có biết bao thứ cần phải được xử lý, mà cứ chuyển đổi ngữ cảnh hoài thì... rất tệ. Bản chất tiến trình xử lý (worker process) sẽ không bao giờ block network traffic hoặc đợi respond từ client cả, cải thiện được tình huống này.

6. Vai trò của cache, các thuật toán apply cho cache (LRU, LFU):
    * Vai trò của cache: Kích thước lưu trữ be bé, thường dùng để lưu trữ những dữ liệu phổ biến được truy xuất nhiều. Từ đó, bộ điều phối sẽ truy cập vào cache đầu tiên để kiểm tra dữ liệu có tồn tại hay không và lấy ra từ nó (Nếu có) chứ không cần phải tương tác quá nhiều vào CSDL của server. Suy ra, cache giúp cải thiện thời gian tải trang, thời gian thực thi, giảm thiểu việc tương tác với CSDL của server và giảm việc mất cân bằng phân phối khi những dữ liệu phổ biến nằm lệch về 1 bên tại server.
    * Vai trò của các thuật toán apply cho cache:
        - LRU (Least recently used): Lưu nhiều dữ liệu thì cache sẽ không đủ chứa cũng như cồng kềnh, cho nên LRU sẽ loại bỏ các mục ít dùng (nằm cuối cache) và giữ lại các mục thường xuyên được truy xuất gần đây nhất (đầu cache) ở trên RAM.
        - LFU (Least frequently used): Mục tiêu tương tự như LRU, nhưng phương pháp thì khác. Mục nào trong cache có SỐ LẦN được truy xuất ít nhất sẽ được xóa đi đầu tiên.
    <br/><br/>![Alt](images/5.png "Cache image") <br/>












<br/><br/>
### Nguồn tham khảo:
1. https://github.com/nesso99/system-design-beginner#relational-database-management-system-rdbms
2. https://viblo.asia/p/shard-database-voi-activerecord-turntable-l0rvmx3kGyqA
3. https://kipalog.com/posts/Cau-chuyen-nhung-nha-tham-hiem-va-nguyen-ly-C-A-P-cua-he-phan-tan
4. http://paginaswebpublicidad.com/questions/23227/su-khac-biet-giua-do-tre-bang-thong-va-thong-luong-la-gi
5. https://www.manifold.co/blog/introduction-to-message-queuing-and-rabbitmq-6cb8e6e9b2
6. https://blog.imaginea.com/scale-part-i-task-queues/
7. https://viblo.asia/p/layer-4-vs-layer-7-load-balancing-on-linux-eBYjv40yvxpV
8. https://longvan.net/load-balancing-can-bang-tai-la-gi.html
9. https://dzone.com/articles/inside-nginx-how-we-designed
10. https://www.hostinger.vn/huong-dan/nginx-la-gi-no-hoat-dong-nhu-the-nao/
11. https://kipalog.com/posts/He-dieu-hanh--Process
12. https://tech.vccloud.vn/cache-bo-nho-dem-la-gi-vai-tro-va-phan-loai-cache-20180618111100714.htm

