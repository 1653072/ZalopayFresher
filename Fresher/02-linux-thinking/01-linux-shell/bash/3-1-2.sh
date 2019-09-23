#!/bin/bash

#------------------------------------------
#NGƯỜI THỰC HIỆN: TRAN KIEN QUOC
#VỊ TRÍ: SOFTWARE DEVELOPMENT FRESHER
#MODULE: 02-LINUX-THINKING
#BÀI TẬP: 3-1-2
#------------------------------------------

#Lấy ra danh sách các file có đuôi là .cpp, .h va .c (Tìm kiếm mọi ngóc ngách trong folder hiện tại).
filelist=`find . -type f -name "*.cpp" -o -name "*.h" -o -name "*.c"`

#Thông qua lệnh `wc -l $fileslist`, mỗi file sẽ có NumRows & FileName (wc: word count, -l: line, thay 
#vì đếm số từ, bây giờ là đếm số dòng bởi vì command có chứa `-l`).
#Ta lấy giá trị của total thông qua /total/ va $1 ($1: Lấy giá trị của ô đầu tiên ở dòng total).
#Lấy giá trị vừa lấy được chia cho 1000 sẽ ra số KLOC của Danh sách các file C/C++.
fileresult=`wc -l $filelist | awk '/total/ {print $1/1000}'`
echo $fileresult

