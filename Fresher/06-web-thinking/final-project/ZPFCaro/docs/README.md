# ZPF CARO DOCUMENT

## ĐỘI NGŨ PHÁT TRIỂN
* Nguyễn Đỗ Cát Trân - VNG Zalopay Fresher 2019
* Trần Kiến Quốc - VNG Zalopay Fresher 2019

## THÔNG TIN CƠ BẢN VỀ ZPF CARO
* FrontEnd: ReactJs và Redux cho quản lí các state, React Bootstrap và tự code cho thiết kế UI/UX.
* BackEnd: Restful APIs, SocketIO APIs cùng với Nodejs.
* Database: Redis và MongoDB.

## CÁC DỮ LIỆU QUAN TRỌNG
* **Link Caro-UI:** [Link](https://www.figma.com/file/LPlQn5YO70rqSxQpyaQRaE/Caro?node-id=0%3A1) hoặc tải file [pdf](./resource/Caro-UI-Prototype.pdf).
* **Link Business Usecase, Data Model, Sequence Diagram, System Architecture:** [Link](https://www.draw.io/?state=%7B%22ids%22:%5B%221oSEWveYZ3lSANbjAN46SNVcgFfxhCaBd%22%5D,%22action%22:%22open%22,%22userId%22:%22117314713924989459588%22%7D#G1oSEWveYZ3lSANbjAN46SNVcgFfxhCaBd)
    * Hoặc tải ảnh [Business Usecase](./resource/Business-Usecase.png).
    * Hoặc tải ảnh [Database-Model](./resource/Database-Model.png).
    * Hoặc tải ảnh [Sequence-Diagram-Playgame](./resource/Sequence-Diagram-Playgame.png).
    * Hoặc tải ảnh [System-Architecture](./resource/System-Architecture.png).
* **Link ZPF Caro Presentation:** [Link](https://docs.google.com/presentation/d/1xTEY6z2fbG_WGpdonSfx5mISWtl8B47DKWD1m__GibA/edit#slide=id.g60ef67db01_1_102)
* **File Global-State:** [File](./resource/Global-State.png)
* **Folder source code:** [Folder](../sourcecode)

## COMPONENT CỦA REACT
* **Sơ nét:** Các SubComponents sẽ cấu tạo nên Components, và các Components sẽ tạo nên Pages.

## RESTFUL APIs
* **Status Code:**
    * 400 | 404: Lỗi phía client, tùy theo API mà có message khác nhau gửi về cho client.
    * 500: Lỗi phía server thực hiện một hành động nào đó thất bại.
* **Phương thức GET:**
    * Lấy danh sách thông tin của tất cả phòng chờ: /gameroom/all
    * Lấy thông tin của một phòng chờ: /gameroom/one?gid=xxx
    * Lấy thông tin ranking top 6: /leaderboard/top6
    * Lấy thông tin ranking của tất cả: /leaderboard/all
    * Lấy thông tin của mình thông qua token: /user
    * Lấy ranking của mình thông qua token: /user/ranking
    * Truy xuất đường dẫn thay đổi password: /resetpassword/`<token>`
* **Phương thức POST:**
    * Đăng nhập: /login
    * Đăng xuất: /logout
    * Đăng kí tài khoản: /register
    * Thêm một phòng chờ: /gameroom
    * Có người chơi (guest) vào phòng chơi: /gameroom/guest
    * Cập nhật tên hiển thị: /user/name
    * Cập nhật email: /user/email
    * Cập nhật password: /user/password
    * Cập nhật avatar: /user/avatar
    * Cập nhật điểm số: /user/points
    * Cập nhật số liệu thắng: /user/winnum
    * Cập nhật số liệu hòa: /user/drawnum
    * Cập nhật số liệu thua: /user/losenum
    * Yêu cầu thay đổi password: /resetpassword
    * Cập nhật password mới: /resetpassword/update

## SOCKETIO APIs
* **Status Code:**
    * 400: Wrong/Expired token
    * 401: Bet points isn't enough
    * 402: Wrong room password
    * 403: Room does not exist anymore
    * 500: Create room fail
    * 501: Update points fail
    * 502: Update guest status fail
    * 200: Success
* **Client Request:**
    * client-request-info-listgameroom
    * client-request-info-leaderboard
    * client-request-chat-in-room
    * client-request-create-room
    * client-request-join-room
    * client-request-mark-pattern
    * client-send-error-in-game
    * host-out-room-not-started
    * client-request-out-room
    * client-request-being-winner
    * client-request-leave-room
* **Server Response:**
    * server-send-info-listgameroom
    * server-send-info-leaderboard
    * server-send-chat-in-room
    * server-send-result-create-room
    * server-send-result-join-room
    * server-send-data-game
    * server-ask-client-leave-room
    * room-has-player-out

## HƯỚNG DẪN KHỞI CHẠY (TEST) CHƯƠNG TRÌNH
* Tải folder `sourcecode` về máy.
* `cd` vào trong folder `sourcecode` và thực hiện lệnh `npm install`.
* `cd` vào trong folder `sourcecode/client` và thực hiện lệnh `npm install`.
* `cd` về lại folder `sourcecode`.
* Khởi chạy MongoDB và Redis.
* Thực hiện lệnh `npm run dev` để chạy chương trình.
* ***Lưu ý:***
    * Cài đặt MongoDB (theo Hệ điều hành của máy tính).
    * Cài đặt MongoDB Compass Community (MCC) để dễ dàng quản lý các dữ liệu lưu trữ.
    * Khởi chạy MongoDB theo các bước bên dưới:
        * Mở MongoDB đã tải về và khởi chạy `mongod`.
        * Mở MCC và kết nối (Không cần config bất kì field nào).
        * Thông qua MCC, tạo Database với tên `ZPFCaro` và một collection đầu tiên `Users` một cách dễ dàng.
        * Tạo thêm collection thứ hai tên là `Games`.
    * Cài đặt Redis (theo Hệ điều hành của máy tính).
    * Mở terminal và chạy lệnh `redis-server`.
