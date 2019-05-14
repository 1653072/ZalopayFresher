#!/bin/bash

#------------------------------------------
#NGUOI THUC HIEN: TRAN KIEN QUOC
#VI TRI: SOFTWARE DEVELOPMENT FRESHER
#MODULE: 02-LINUX-THINKING
#BAI TAP: 3-3
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
		#Doc du lieu tu file vao Mang So Nguyen Duong (array)
		#Do dai mang la arraylength
		#Khai bao bien sum=0 de tien hanh cong don cac so
		array=($(<$input))		
		arraylength=${#array[*]}
		sum=0

		for ((i=0; i<$arraylength; ++i))
		do
			#Cac phan tu co so '0' o dau (VD: 054) se duoc loai bo so '0' thanh so 54
			temp=$((10#${array[i]}))
			
			#Thao tac cong don
			sum=$[$sum+$temp]
		done

		echo "Sum of all numbers in the $filename is $sum"
	fi
}

Run


