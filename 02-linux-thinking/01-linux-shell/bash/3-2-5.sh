#!/bin/bash

#------------------------------------------
#NGƯỜI THỰC HIỆN: TRAN KIEN QUOC
#VỊ TRÍ: SOFTWARE DEVELOPMENT FRESHER
#MODULE: 02-LINUX-THINKING
#BÀI TẬP: 3-2-5
#------------------------------------------

HOMEPATH="/home/cpu11817"

function PrintAllFiles() {
	filelist=`sudo find $HOMEPATH -type f -size +100k`
	for i in $filelist
	do
		echo $i
	done
}

function DoDelete() {
	echo "Type exactly file name you want to delete: "
	read filename
	
	input=`sudo find $HOMEPATH -type f -name $filename`
	if ! [ -f "$input" ]
	then 	
		echo ">>>File $filename does not exist!"
	else
		echo ">>>Are you sure to delete $filename [y/n]: "
		read check

		if [ $check = "y" ]
		then 
			rm -f $input
			logfile=$HOMEPATH/deletedfilelog.txt
			echo "$(date +%d-%m-%Y-%H-%M-%S): Deleted file $input" >> $logfile
			echo ">>>Deleted file $filename succeeded!"
			echo ">>>Infomation about deleteion is stored at $logfile!"
		else 
			echo ">>>You canceled the file deletion of $filename!"
		fi
	fi

	pause 'Press [Enter] key to continue...'
}

function DoCompress() {
	echo "Type exactly file name you want to compress: "
	read filename
	
	if ! [ -d "$HOMEPATH/CompressFolder" ]
	then `mkdir $HOMEPATH/CompressFolder`
	fi
		
	input=`sudo find $HOMEPATH -type f -name $filename`
	output=$HOMEPATH/CompressFolder/$filename-$(date +%d%m%Y-%H%M%S).zip
		
	result=`zip -j $output $input`
	if [[ $result == *"error"* ]]
	then echo ">>>Compressed file fail!"
	else echo ">>>Compressed file $filename to $output succeeded!"
	fi

	pause 'Press [Enter] key to continue...'

	#deflated: How much space was removed from the source file when it was compressed
	#-j: Eliminate all directory info and only save files.
	#The default compression level is -6, the best compression level is -9 (optimal but slowest)
	#Do nothing is -0, the fastest compression level is -1
	#See more: http://www.linuxguide.it/command_line/linux-manpage/do.php?file=zip
}

function pause() {
   read -p "$*"
}

function Run() {
	stop=0
	while [ $stop -eq 0 ]; 
	do
		clear
		PrintAllFiles

		val=-1
		while [ $val -lt 0 ] || [ $val -gt 2 ];
		do
			echo -e "Press '0': Stop \nPress '1': Delete file \nPress '2': Compress file"
			read val
			if [ $val -lt 0 ] || [ $val -gt 2 ] 
			then echo -e ">>>Wrong syntax!\n"
			fi
		done
		
		if [ $val -eq 0 ] 
		then stop=`echo 1`
		else 
			if [ $val -eq 1 ] 
			then DoDelete
			else
				if [ $val -eq 2 ] 
				then DoCompress
				fi
			fi
	
		fi
	done
}

Run

