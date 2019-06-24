# DATABASE THINKING

## NGƯỜI THỰC HIỆN

* Họ tên: Trần Kiến Quốc (QuocTk)
* Vị trí: Software Development Fresher

<br/>

## LÝ THUYẾT 
* Lý thuyết về MySQL: Xem [tại đây](./MySQL/README.md).
  * Ưu/nhược điểm của các storage engine cơ bản của MySQL: InnoDB, MyISAM,...
  * Cài đặt và thao tác với MySQL.
  * Các kiểu dữ liệu cơ bản của MySQL, kiểu dữ liệu đặc biệt & cách xử lý chúng.
  * Transaction của MySQL.
  * Isolation.
  * Connector.
* Lý thuyết về Redis: Xem [tại đây](./Redis/README.md).
  * Các version của MySQL.
  * Cài đặt và làm quen với các lệnh trong Redis.
  * Làm quen với Pub/Sub
  * Các khái niệm và vấn đề xoay quay Lock.

<br/>

## BÀI TẬP
* Thiết kế schema cho chương trình chat - trò chuyện (với Redis và với MySQL), sử dụng Python để tương tác.
* Mô tả chương trình chat: cơ chế tương tự Zalo, Message.
* Cơ bản:
  * Tạo tài khoản (username/password, email,...).
  * Chọn người trò chuyện (theo username hoặc email).
  * Hiển thị lịch sử trò chuyện (nếu có).
  * Trò chuyện (chat).
* Nâng cao:
  * Kết bạn
  * Chat trong nhóm
  * Hiển thị trạng thái online/offline của người khác
  * Hiện thị trạng thái tin nhắn (seen)
* Hướng dẫn
  * Thiết kế hệ thống tài khoản
  * Thiết kế cấu trúc lưu trữ lịch sử chat
  * Thiết kế cấu trúc lưu trữ nội dung tin nhắn

<br/>

## HƯỚNG DẪN THỰC HIỆN BÀI TẬP
* Xem mô tả & hướng dẫn thực hiện 3 bài tập [tại đây](./BaiTap/README.md)

<br/>

## DỮ LIỆU PHỤC VỤ CHO BÀI TẬP
* Dữ liệu cho [Bài tập 3-1](./BaiTap/Chat).