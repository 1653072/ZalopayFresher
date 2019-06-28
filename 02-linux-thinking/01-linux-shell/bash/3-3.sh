#!/bin/bash

#------------------------------------------
#NGƯỜI THỰC HIỆN: TRAN KIEN QUOC
#VỊ TRÍ: SOFTWARE DEVELOPMENT FRESHER
#MODULE: 02-LINUX-THINKING
#BÀI TẬP: 3-3
#------------------------------------------

HOMEPATH="/home/cpu11817"

function Run() {
	echo "Type exactly file name which contains data: "
	read filename
	
	input=`sudo find $HOMEPATH -type f -name $filename`
	if ! [ -f "$input" ]
	then 	
		echo ">>>File $filename does not exist!"
	else
		#Đọc dữ liệu từ file vào mảng số nguyên dương
		#Xác định độ dài/kích cỡ mảng cho biến arraylength
		#Khai báo biến sum=0 để tiến hành cộng dồn các số
		array=($(<$input))		
		arraylength=${#array[*]}
		sum=0

		for ((i=0; i<$arraylength; ++i))
		do
			#Các phần tử có số 0 ở đầu (VD: 054) sẽ được loại bỏ số '0', thành số 54.
			temp=$((10#${array[i]}))
			
			#Thao tác cộng dồn
			sum=$[$sum+$temp]
		done

		echo "Sum of all numbers in the $filename is $sum"
	fi
}

Run

