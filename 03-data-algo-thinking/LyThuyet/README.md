# DATA ALGO THINKING

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

<br/>

## Mục lục

- [Cấu trúc dữ liệu](#A)
  - [Cấu trúc dữ liệu xác suất (Probabilistic Data Structures)](#A1)
    - [Tính chất của PDS](#A1.1)
    - [Bloom Filters](#A1.2)
    - [Cuckoo Filters](#A1.3)
    - [Count Min Sketch](#A1.4)
    - [HyperLogLog](#A1.5)
  - [Trie](#A2)
    - [Khái niệm](#A2.1)
    - [Ứng dụng](#A2.2)
- [Các mẫu thiết kế (Design Pattern)](#B)
  - [Mẫu Factory](#B1)
  - [Mẫu Singleton](#B2)
  - [Mẫu Composite](#B3)
  - [Mẫu Iterator](#B4)
  - [Mẫu Facade](#B5)
- [Nguyên tắc lập trình](#C)
  - [SOLID](#C1)
  - [DRY](#C2)
  - [KISS](#C3)
  - [YAGNI](#C4)
  - [Do the simplest thing that could possibly work](#C5)
  - [Clean code](#C6)
    - [Khái niệm](#C6.1)
    - [Ít nhất 5 cách trong clean code](#C6.2)
- [Nguồn tham khảo](#D)

<br/>

<span name="A"></span>

## CẤU TRÚC DỮ LIỆU

<span name="A1"></span>

1. Cấu trúc dữ liệu xác suất (Probabilistic Data Structures)

   <span name="A1.1"></span>

   * Tính chất của PDS: 

   <span name="A1.2"></span>

   * Bloom Filters:

   <span name="A1.3"></span>

   * Cuckoo Filters:

   <span name="A1.4"></span>

   * Count Min Sketch:

   <span name="A1.5"></span>

   * HyperLogLog:

<span name="A2"></span>

2. Trie
   <span name="A2.1"></span>

   * Khái niệm:

   <span name="A2.2"></span>

   * Ứng dụng:

<br/>

<span name="B"></span>

## DESIGN PATTERN

<span name="B1"></span>

1. **Factory (FP):**
   * **Khái niệm:**
        * Thuộc nhóm khởi tạo.
        * Nhiệm vụ: Quản lý và trả về các đối tượng theo yêu cầu, giúp cho việc khởi tạo đối tượng một cách linh hoạt hơn.
        * Ví dụ: Cần mua ô tô thì ta phải đến MỖI HÃNG để xem ô tô, dẫn đến mất đến thời gian. Nhằm tiết kiệm thời gian hơn, ta đến trung tâm đại lý ô tô, nơi "tổng hợp" các ô tô từ CÁC HÃNG mà ta tha hồ lựa chọn.

   * **Code minh họa:**
        ```
        public interface Car {
            void view();
        }
        
        public class Honda implements Car {
            @Override
            public void view() {
                System.out.printf("Honda view");
            }
        }

        public class Nexus implements Car {
            @Override
            public void view() {
                System.out.printf("Nexus view");
            }
        }

        public class Toyota implements Car {
            @Override
            public void view() {
                System.out.printf("Toyota view");
            }
        }

        public class CarFactory {
            public void viewCar(String carType) {
                Car car;
                if (carType.equalsIgnoreCase("HONDA"))
                {
                    car = new Honda();
                    car.view();
                }
                else
                    if (carType.equalsIgnoreCase("NEXUS"))
                    {
                        car = new Nexus();
                        car.view();
                    }
                    else
                        if (carType.equalsIgnoreCase("TOYOTA"))
                        {
                            car = new Toyota();
                            car.view();
                        }
            }
        }

        public class Boss {
            public void viewCar() {
                CarFactory carFactory = new CarFactory();
                carFactory.viewCar("HONDA");
                carFactory.viewCar("NEXUS");
                carFactory.viewCar("TOYOTA");
            }

        }
        ```

<span name="B2"></span>

2. **Singleton (SP):**
   * **Khái niệm:**
        * Thuộc nhóm khởi tạo.
        * Nhiệm vụ: Đảm bảo rằng một class chỉ có duy nhất một instance và cung cấp một cách "toàn cầu" để truy cấp tới instance đó.
        * Ví dụ: Tàu mẹ (mothership) vận chuyển nguyên vật liệu qua lại giữa Mặt trăng và Sao hỏa để các con robot trên Sao hỏa có thêm nguyên liệu để tiếp tục thực hiện "Địa khai phá". Chỉ duy nhất một tàu mẹ thực hiện xuyên suốt nhiệm vụ này.

   * **Code minh họa:**
        * `Khởi tạo sớm`: Đây là cách dễ nhất nhưng nó có một nhược điểm là mặc dù instance đã được khởi tạo nhưng có thể sẽ không dùng tới.
        ```
        public class EagerInitializedSingleton {
            private static final EagerInitializedSingleton instance = new EagerInitializedSingleton();

            //private constructor to avoid client applications to use constructor
            private EagerInitializedSingleton() {}

            public static EagerInitializedSingleton getInstance()
            {
                return instance;
            }
        }
        ```
        * `Khởi tạo trễ`: Cách này đã khắc phục được nhược điểm của cách 1 Eager initialization, chỉ khi nào getInstance được gọi thì instance mới được khởi tạo. Tuy nhiên cách này chỉ sử dụng tốt trong trường hợp đơn luồng, trường hợp nếu có 2 luồng cùng chạy và cùng gọi hàm getInstance tại cùng một thời điểm thì đương nhiên chúng ta có ít nhất 2 thể hiện của instance.
        ```
        public class LazyInitializedSingleton {
            private static LazyInitializedSingleton instance;

            private LazyInitializedSingleton() {}

            public static LazyInitializedSingleton getInstance()
            {
                if(instance == null)
                {
                    instance = new LazyInitializedSingleton();
                }
                return instance;
            }
        }
        ```
        * `Khởi tạo luồng an toàn`: Gọi phương thức synchronized cho một đoạn mã quan trọng.
        ```
        public class ThreadSafeSingleton {
            private static ThreadSafeSingleton instance;

            private ThreadSafeSingleton() {}

            public static ThreadSafeSingleton getInstance()
            {
                if (instance == null)
                {
                    synchronized(ThreadSafeSingleton.class)
                    {
                        if (instance == null)
                        {
                            instance = new Trie();
                        }
                    }
                }
                
                return instance;
            }
        }
        ```

<span name="B3"></span>

3. **Composite (CP):**
   * **Khái niệm:**
        * Thuộc nhóm cấu trúc.
        * Tổ chức các đối tượng theo cấu trúc phân cấp dạng cây. Tất cả các đối tượng trong cấu trúc được thao tác theo một cách thuần nhất như nhau.
        * Tạo quan hệ thứ bậc bao gộp giữa các đối tượng.
        * Client có thể xem đối tượng bao gộp và bị bao gộp như nhau, giúp tăng khả năng tổng quát hoá trong code cũng như dễ phát triển, nâng cấp, bảo trì code.
        * Ví dụ: Folder có thể chứa Folder và File, Folder bên trong Folder lại có thể chứa các Folder & File khác,...

        ![Folder-File-Composite](./images/1.png)

   * **Code minh họa:**
        * `FileComponent.java`
        ```
        public interface FileComponent {
            void showProperty();
            long totalSize();
        }
        ```
        * `FileLeaf.java`
        ```
        public class FileLeaf implements FileComponent {
            private String name;
            private long size;
        
            public FileLeaf(String name, long size) {
                super();
                this.name = name;
                this.size = size;
            }
        
            @Override
            public long totalSize() {
                return size;
            }
        
            @Override
            public void showProperty() {
                System.out.println("FileLeaf [name=" + name + ", size=" + size + "]");
            }
        }
        ```
        * `FolderComposite.java`
        ```
        import java.util.ArrayList;
        import java.util.List;
        
        public class FolderComposite implements FileComponent {
            private List<FileComponent> files = new ArrayList<>();
        
            public FolderComposite(List<FileComponent> files) {
                this.files = files;
            }
        
            @Override
            public void showProperty() {
                for (FileComponent file : files) 
                {
                    file.showProperty();
                }
            }
        
            @Override
            public long totalSize() {
                long total = 0;
                for (FileComponent file : files) 
                {
                    total += file.totalSize();
                }
                return total;
            }
        }
        ```
        * `Client.java`
        ```
        import java.util.Arrays;
        import java.util.List;
        
        public class Client {
            public static void main(String[] args) {
                FileComponent file1 = new FileLeaf("file 1", 10);
                FileComponent file2 = new FileLeaf("file 2", 5);
                FileComponent file3 = new FileLeaf("file 3", 12);
        
                List<FileComponent> files = Arrays.asList(file1, file2, file3);
                FileComponent folder = new FolderComposite(files);
                folder.showProperty();
                System.out.println("Total Size: " + folder.totalSize());
            }
        }
        ```

<span name="B4"></span>

4. **Iterator (IP):**
   * **Khái niệm:**
        * Thuộc nhóm hành vi/tương tác.
        * Truy xuất các phần tử của đối tượng dạng tập hợp tuần tự (list, array,...) mà không phụ thuộc vào biểu diễn bên trong của các phần tử.
        * Client có thể sử dụng Iterator (cũng như các phương thức cơ bản của nó như: hasNext, next, remove,...) để làm cầu nối với tập hợp, như hình dưới:

        ![Iterator-Pattern](./images/2.png)

   * **Code minh họa:**
        * `Item.java`
        ```
        public class Item {
            private String title;
            private String url;
        
            public Item(String title, String url)
            {
                super();
                this.title = title;
                this.url = url;
            }
        
            @Override
            public String toString()
            {
                return "Item [title=" + title + ", url=" + url + "]";
            }
        }
        ```
        * `ItemIterator.java`
        ```
        public interface ItemIterator<T>
        {
            boolean hasNext();
            T next();
        }
        ```
        * `Menu.java`
        ```
        import java.util.ArrayList;
        import java.util.List;
        
        public class Menu {
            private List<Item> menuItems = new ArrayList<>();
        
            public void addItem(Item item)
            {
                menuItems.add(item);
            }
        
            public ItemIterator<Item> iterator()
            {
                return new MenuItemIterator();
            }
        
            class MenuItemIterator implements ItemIterator<Item>
            {
                private int currentIndex = 0;
        
                @Override
                public boolean hasNext()
                {
                    return currentIndex < menuItems.size();
                }
        
                @Override
                public Item next()
                {
                    return menuItems.get(currentIndex++);
                }
            }
        }
        ```
        * `Client.java`
        ```
        public class Client {
            public static void main(String[] args) {
                Menu menu = new Menu();
                menu.addItem(new Item("Home", "/home"));
                menu.addItem(new Item("Java", "/java"));
                menu.addItem(new Item("Spring Boot", "/spring-boot"));
        
                ItemIterator<Item> iterator = menu.iterator();
                while (iterator.hasNext())
                {
                    Item item = iterator.next();
                    System.out.println(item);
                }
            }
        }
        ```

<span name="B5"></span>

5. **Facade (FP):**
   * **Khái niệm:**
        * Thuộc nhóm cấu trúc.
        * Nhiệm vụ: Cung cấp một giao diện chung đơn giản thay cho một nhóm các giao diện có trong một hệ thống con (subsystem). Từ đó, nó định nghĩa một giao diện ở một cấp độ cao hơn để giúp cho người dùng có thể dễ dàng sử dụng hệ thống con này.
        
        ![Facade-Pattern](./images/3.png)
        
   * **Code minh họa:**
        * `AccountService.java`
        ```
        public class AccountService {
            public void getAccount(String email)
            {
                System.out.println("Getting the account of " + email);
            }
        }
        ```
        * `PaymentService.java`
        ```
        public class PaymentService {
            public void paymentByPaypal()
            {
                System.out.println("Payment by Paypal");
            }
        
            public void paymentByCreditCard()
            {
                System.out.println("Payment by Credit Card");
            }
        
            public void paymentByEbankingAccount()
            {
                System.out.println("Payment by E-banking account");
            }
        
            public void paymentByCash()
            {
                System.out.println("Payment by cash");
            }
        }
        ```
        * `ShippingService.java`
        ```
        public class ShippingService {
            public void freeShipping()
            {
                System.out.println("Free Shipping");
            }
        
            public void standardShipping()
            {
                System.out.println("Standard Shipping");
            }
        
            public void expressShipping()
            {
                System.out.println("Express Shipping");
            }
        }
        ```
        * `EmailService.java`
        ```
        public class EmailService {
            public void sendMail(String mailTo)
            {
                System.out.println("Sending an email to " + mailTo);
            }
        }
        ```
        * `SmsService.java`
        ```
        public class SmsService {
            public void sendSMS(String mobilePhone)
            {
                System.out.println("Sending an mesage to " + mobilePhone);
            }
        }
        ```
        * `ShopFacade.java`
        ```
        public class ShopFacade {
            private static final ShopFacade INSTANCE = new ShopFacade();
        
            private AccountService accountService;
            private PaymentService paymentService;
            private ShippingService shippingService;
            private EmailService emailService;
            private SmsService smsService;
        
            private ShopFacade()
            {
                accountService = new AccountService();
                paymentService = new PaymentService();
                shippingService = new ShippingService();
                emailService = new EmailService();
                smsService = new SmsService();
            }
    
            public static ShopFacade getInstance()
            {
                return INSTANCE;
            }
        
            public void buyProductByCashWithFreeShipping(String email)
            {
                accountService.getAccount(email);
                paymentService.paymentByCash();
                shippingService.freeShipping();
                emailService.sendMail(email);
                System.out.println("Done\n");
            }
    
            public void buyProductByPaypalWithStandardShipping(String email, String mobilePhone)
            {
                accountService.getAccount(email);
                paymentService.paymentByPaypal();
                shippingService.standardShipping();
                emailService.sendMail(email);
                smsService.sendSMS(mobilePhone);
                System.out.println("Done\n");
            }
        }
        ```
        * `Client.java` (Kết hợp giữa `Facade` và `Singleton`)
        ```
        public class Client {
            public static void main(String[] args) {
                ShopFacade.getInstance().buyProductByCashWithFreeShipping("contact@gpcoder.com");
                ShopFacade.getInstance().buyProductByPaypalWithStandardShipping("gpcodervn@gmail.com", "0988.999.999");
            }
        }
        ```

<br/>

<span name="C"></span>

## NGUYÊN TẮC LẬP TRÌNH

<span name="C1"></span>

1. **SOLID**
   
   ![SOLID](./images/4.png)

   * **S:**
        * Một class chịu trách nhiệm 1 việc.
        * Ví dụ: Class Person chứa Họ tên, SĐT, Email, Cách chào hỏi và Hàm xác thực Email. Lúc này, "Hàm xác thực Email" trở nên không hợp lý khi nằm ở class Person này. Do vậy, ta tách thuộc tính Email và Hàm xác thực Email ra thành một class riêng biệt, tên là Email. Cuối cùng, class Person sử dụng Class Email như một thuộc tính và thỏa đặc tính **`S`** trong SOLID.
    
    * **O:**
        * Chỉ nên mở rộng một class bằng cách `kế thừa`. Tuyệt đối không mở rộng class bằng cách `sửa đổi` nó.
        * Điểm mấu chốt của nguyên tắc này là: **`Chỉ được THÊM mà không được SỬA`**.
        * Ví dụ: Có 2 class là Rectangle và Square, 1 hàm là computeArea. Nếu như bổ sung thêm class Circle thì ta phải sửa code ở hàm computeArea, dẫn đến vi phạm **`O`**. Do vậy, ta phải tạo 1 interface Shape chứa hàm ảo computeArea, các class hình học sẽ có thuộc tính riêng biệt nhưng bắt buộc implements lại hàm computeArea của Shape. Cuối cùng, ta "THÊM" class Circle mà không đụng chạm gì đến các class/hàm khác.

    * **L:**    
        * Trong một chương trình, các `object` của `class con` có thể thay thế `class cha` mà không làm thay đổi tính đúng đắn của chương trình.
        * Nguyên tắc này khuyến khích chúng ta sử dụng tính đa hình trong lập trình hướng đối tượng.

    * **I:**
        * Nên tách Interface lớn thành nhiều interface nhỏ với những mục đích riêng biệt.
        * Ví dụ: Sau khi tính diện tích xong thì mã hóa kết quả thành JSON rồi gửi trả client. Nếu như 1 interface Shape chứa hàm computeArea lẫn hàm serialize thì đã vi phạm **`I`**, vì có những trường hợp client chỉ cần kết quả diện tích mà không cần mã hóa JSON. Cuối cùng, ta phải tách interface Shape thành 2 interface khác nhau, 1 là interface computeArea và 1 là interface serialize. Client cần implements gì thì cài đặt interface đó là xong.

    * **D:**
        * Interface dường như là một yếu tố cơ bản nhất của mọi nguyên tắc trên, nên khi sử dụng, cần phải cẩn thận và tuân thủ các nguyên tắc.
        * Đồng thời, **`D`** là nguyên tắc quan trọng nhất trong nguyên lý SOLID và nằm ở cuối cùng, đó chính là **`tổng hợp 4 nguyên tắc trước`** (cho việc sử dụng interface).

    * Xem chi tiết source code cho SOLID [tại đây](https://topdev.vn/blog/nguyen-ly-solid-la-gi-nguyen-ly-solid-trong-node-js-voi-typescript/?fbclid=IwAR0JmVECIbywQ2Hj6DvpNL9EJYgX6FeXKOIPugx3Yc6keo8yMGb4PgWmdMg).

<span name="C2"></span>

2. **DRY**

   * Don't Repeat Yourself hay DRY là một nguyên lý cơ bản nhất của lập trình được đưa ra nhằm mục đích hạn chế tối thiểu việc viết các đoạn code lặp đi lặp lại nhiều lần chỉ để thực hiện các công việc giống nhau trong ứng dụng. Thay vào đó, hãy đóng gói nó thành phương thức riêng, đến khi cần thì chỉ cần gọi tên nó ra để sử dụng.

   * Ví dụ: Code hàm kiểm tra Email (tính năng đăng nhập) cho trang admin, vài tuần sau có thêm trang admin mới cần phải kiểm tra vụ đăng nhập, thế là bưng code cũ qua xài tiếp. Vài tháng kế tiếp lại có thêm trang admin mới, lúc này bưng code qua xài tiếp. Tuy nhiên, chỉ cần có 1 sự thay đổi nhỏ như là, ngoài việc kiểm tra Email đăng nhập có khớp với Email admin hay không, mà còn kiểm tra ngày khởi tạo tài khoản có hơn 1 tháng hay không, lúc này bạn sẽ phải sửa code không những ở trang admin này mà còn một đống trang admin phía sau, dẫn đến tốn thời gian. Thay vào đó nên viết một hàm/class xài chung & tổng quát hóa.

   * Tình huống ngoại lệ: Tình huống gấp rút, số lượng trang admin biết trước và ít ỏi thì ta có thể bỏ qua nguyên tắc DRY. Ngược lại, ta nên áp dụng DRY.

   * Xem thêm chi tiết [tại đây](https://www.codehub.vn/Nguyen-Ly-DRY-Dont-Repeat-Yourself).

<span name="C3"></span>

3. **KISS**

   * KISS (Keep It Simple, Stupid), tạm dịch là "giữ cho mọi thứ đơn giản đi, ngốc ạ”. Hoặc các biến thể khác như "Keep It Short and Simple", "Keep It Simple and Straightforward" và "Keep It Small and Simple".

   * Trong lập trình, KISS nghĩa là hãy làm cho mọi thứ (mã lệnh) trở nên đơn giản nhằm dễ nhìn và dễ đọc. Hãy chia nhỏ vấn đề và giải quyết từng cái. Đừng viết những lớp hay phương thức theo kiểu tổng hợp hay lẫn lộn (tất cả trong một). Đồng thời, hãy để số lượng dòng code của một lớp hay phương thức ở con số hàng chục, hạn chế lên hàng trăm, hàng nghìn.

<span name="C4"></span>

4. **YAGNI**

   * YAGNI (You Aren’t Gonna Need It), tạm dịch là "bạn sẽ không cần nó". Hãy xây dựng cái bạn cần khi mà bạn thực sự cần đến nó, hãy xông xáo tái cấu trúc nó khi cần thiết. Đừng dành quá nhiều thời gian để lên kế hoạch cho những thứ lớn lao, và những kịch bản tương lai không biết trước. Phần mềm tốt là cái mà có thể tiến hóa thành sản phẩm hoàn thiện theo thời gian.

   * Thực tế hơn, ta nên tập trung xây dựng chức năng giải quyết vấn đề ở thời điểm hiện tại, vấn đề mà khách hàng cần giải quyết, không cần lãng phí thời gian vào một chức năng "Có thể sử dụng đến" => Đừng tự vẽ vời thêm việc cho bản thân.

<span name="C5"></span>

5. **Do the simplest thing that could possibly work**

   * Tạm dịch là "làm các thứ đơn giản nhất mà nó chạy được".

   * Đối với các tester, điều đó có nghĩa là bắt đầu với một bài kiểm tra đơn vị đơn giản (simple unit test) và chỉ tăng dần độ phức tạp khi nó đã & vẫn đang hoạt động được.

   * Đối với designer, điều đó có nghĩa là bắt đầu với một cái gì đó thật đơn giản, và theo thời gian, tăng dần sự phức tạp, cầu kỳ nhưng phải có ý nghĩa (thêm thắt nhiều chi tiết mà làm tăng sự "rối mắt, nhức não" cho sản phẩm thì cũng vô nghĩa).

   * Có hai cách để thiết kế phần mềm: Một cách là làm cho nó đơn giản đến mức không còn thiếu sót, và cách khác là làm cho nó phức tạp đến mức thiếu sót khó mà thấy rõ. Phương pháp đầu tiên dẫu khó khăn nhưng cực kì có lợi, không những việc mở rộng phần mềm trở nên dễ dàng hơn mà còn là bảo trì, bàn giao sản phẩm,...

   * Xem thêm [tại đây](http://www.agilenutshell.com/simplest_thing).

<span name="C6"></span>

6. **Clean code**

   <span name="C6.1"></span>

   * **Khái niệm:**

        * Về hình thức:
            * Cách trình bày code: Căn lề, sử dụng tab, space,... sao cho dễ đọc, dễ nhìn.
            * Cách đặt tên biến, hàm, class có theo quy ước không.
            * Cách phân phối lượng code (số dòng code trong file, số dòng code trong 1 method,...) là bao nhiêu.
        * Về nội dung:
            * Cách đặt tên hàm, tên biến phải dễ hiểu.
            * Cách viết comment cho code, khi nào cần viết comment, khi nào không.
            * Thiết kế, xây dựng cấu trúc cho đối tượng, dữ liệu nhằm dễ sử dụng và mở rộng.
            * Cách xử lý ngoại lệ (Exception) có ổn không.
            * Khả năng bảo trì, mở rộng của code,...
        * Kết luận:
            * Bjnarne Stroustrup tác giả cuốn sách “The C++ Programming Language” đưa ra quan điểm của mình: Ông muốn code của mình phải hiệu quả và đẹp. Tất cả các hàm business logic phải rõ ràng và bugs dễ dàng tìm thấy. Code phải dễ dàng bảo trì, các ngoại lệ phải được bắt một cách rõ ràng. Phải tối ưu hóa các performance, tránh viết code quá phức tạp gây khó khăn cho người khác.
            * Grady Booch tách giả cuốn sách “Object oriented analysic and design with Applications” đưa ra quan điểm của mình: Viết code đơn giản, code phải dễ đọc và dễ hiểu cho người khác. Code phải có ý nghĩa và dễ quản lý.

   <span name="C6.2"></span>

   * **Ít nhất 5 cách để được clean code:**

        * General rules:
            * Tuân thủ quy ước chung mà team đặt ra.
            * Tuân thủ nguyên tắc KISS.
            * Tìm gốc gác của mọi vấn đề/lỗi (nếu có) thay vì "đối phó" nó.
        * Names rules:
            * Tên phân biệt cho mỗi tính năng/trường hợp, không trùng lắp.
            * Tên mô tả được bản chất của nó cũng như hàm một cách rõ ràng.
            * Tránh "mã hóa hoặc nối thêm tiền tố (Ví dụ: m_compute, _absolute).
            * Tên phát âm được (Ví dụ: DateTime, không được DatehhMMss).
        * Functions rules:
            * Hàm nhỏ, không quá nhiều dòng code.
            * Mỗi hàm chỉ làm `đúng` nghĩa vụ của nó.
            * Tên hàm mô tả được nghĩa vụ của nó.
            * Ít tham số truyền vào hàm.
        * Comments rules:
            * Giải thích những phần mà mình cho là khó hiểu, cần phải tường minh.
            * Không giải thích dư thừa: Viết quá nhiều từ, chữ hoặc chỗ nào cũng giải thích (kể cả chỗ dễ hiểu nhất).
            * Sử dụng cho trường hợp: Cảnh báo, giải thích ngữ nghĩa hàm/từ/ý tưởng,...
        * Tests:
            * Mỗi một kiểm tra đặt ở đâu là phải có "assert" chỗ đó.
            * Các bài kiểm tra phải độc lập nhau, hạn chế kiểm tra này phụ thuộc kiểm tra kia.
            * Kiểm tra lại theo khoảng thời gian nhất định và các kiểm tra đó người xem phải đọc/xem được. (Kiểm tra mà không xem/đọc được kết quả có đúng đắn hay không thì cũng vô nghĩa).
        
<br/>

<span name="D"></span>

## NGUỒN THAM KHẢO
1. <https://gpcoder.com/4164-gioi-thieu-design-patterns/>
2. <https://viblo.asia/p/design-pattern-factory-pattern-part-1-XqaGEmxZGWK>
3. <https://viblo.asia/p/hoc-singleton-pattern-trong-5-phut-4P856goOKY3>
4. <https://viblo.asia/p/design-pattern-composite-AeJ1vOzAGkby>
5. <https://gpcoder.com/4554-huong-dan-java-design-pattern-composite/>
6. <https://gpcoder.com/4724-huong-dan-java-design-pattern-iterator/>
7. <https://gpcoder.com/4604-huong-dan-java-design-pattern-facade/>
8. <https://stackjava.com/design-pattern/facade-pattern.html>
9. <https://topdev.vn/blog/nguyen-ly-solid-la-gi-nguyen-ly-solid-trong-node-js-voi-typescript/?fbclid=IwAR0JmVECIbywQ2Hj6DvpNL9EJYgX6FeXKOIPugx3Yc6keo8yMGb4PgWmdMg>
10. <https://www.codehub.vn/Nguyen-Ly-DRY-Dont-Repeat-Yourself>
11. <https://vinacode.net/2015/03/11/lap-trinh-vien-can-nho/>
12. <https://hanoiict.edu.vn/cac-nguyen-tac-solid-yagni-kiss-dry-trong-lap-trinh>
13. <http://www.agilenutshell.com/simplest_thing>
14. <https://stackjava.com/clean-code/clean-code-la-gi.html>
15. <https://techtalk.vn/clean-code-ma-sach-va-con-duong-tro-thanh-better-developer.html>
16. <https://techtalk.vn/clean-code-ma-sach-va-con-duong-tro-thanh-better-developer-p2.html>
17. <https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29>
18. <http://shhetri.github.io/clean-code/#/16>