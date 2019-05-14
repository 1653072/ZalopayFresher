#!/bin/bash

#------------------------------------------
#NGUOI THUC HIEN: TRAN KIEN QUOC
#VI TRI: SOFTWARE DEVELOPMENT FRESHER
#MODULE: 02-LINUX-THINKING
#BAI TAP: 3-1-2
#------------------------------------------

#Danh sach cac file co duoi la .cpp, .h va .c (Tim kiem moi ngoc ngach trong folder hien tai)
filelist=`find . -type f -name "*.cpp" -o -name "*.h" -o -name "*.c"`

#Thong qua lenh wc -l $fileslist, moi file co NumRows & FileName (wc: word count, -l: line)
#Ta lay gia tri cua total (o dau tien cua dong cuoi cung) thong qua /total/ va $1
#Lay gia tri lay duoc chia 1000 se ra so KLOC cua Danh sach file
fileresult=`wc -l $filelist | awk '/total/ {print $1/1000}'`
echo $fileresult


