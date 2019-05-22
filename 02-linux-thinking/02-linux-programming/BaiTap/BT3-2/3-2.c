#include <stdio.h> 
#include <stdlib.h>
#include <dirent.h> 
#include <sys/stat.h>
#include <pwd.h>
#include <grp.h>
#include <string.h>
#include <time.h>
#include <linux/limits.h>     //For PATH_MAX = 4096 chars

//=======================================================
//DECLARE FUNCTIONS
void getTotalSize();
void run_ls_l();
char *permissions(__mode_t perm);
char *filetype(__mode_t perm);
char *add0WhenBelow10(int val);
char *getDateTime(__time_t dt);
void printFileNameColor(char filename[256], __mode_t perm);
void printFile(struct stat info, char filename[256]);

//=======================================================
//IMPLEMENT FUNCTIONS
void getTotalSize() {
     // Con trỏ chỉ đến từng thư mục
    struct dirent *entry; 

    // Mở thư mục hiện hành để tiến hành liệt kê
    DIR *dir = opendir("."); 
  
    // Mở thư mục hiện hành thất bại
    if (dir == NULL)  
    { 
        printf(">>Mở thư mục hiện hành thất bại!"); 
        return; 
    } 

    long sum=0;
    while ((entry = readdir(dir)) != NULL) 
    {   
        // Loại trừ 2 thư mục "." và ".." và các thư mục/file hidden
        if(strcmp(entry->d_name,"..")!=0 && strcmp(entry->d_name, ".")!=0 && entry->d_name[0]!='.')
        {
            char path[PATH_MAX + 1]; // +1 for '\0'
            realpath(entry->d_name, path);
            struct stat info;
            if(stat(path, &info) < 0) fprintf(stderr, " error\n");
            sum = sum + (512*info.st_blocks/1024);
        }
    }
    printf("total %ld\n", sum);
}

void run_ls_l() {
    // Con trỏ chỉ đến từng thư mục
    struct dirent *entry; 

    // Mở thư mục hiện hành để tiến hành liệt kê
    DIR *dir = opendir("."); 
  
    // Mở thư mục hiện hành thất bại
    if (dir == NULL)  
    { 
        printf(">>Mở thư mục hiện hành thất bại!"); 
        return; 
    } 

    while ((entry = readdir(dir)) != NULL) 
    {
        // Loại trừ 2 thư mục "." và ".." và các thư mục/file hidden
        if(strcmp(entry->d_name,"..")!=0 && strcmp(entry->d_name, ".")!=0 && entry->d_name[0]!='.')
        {
            // Từ tên file, lấy nguyên đường dẫn đầy đủ đến file.
            char path[PATH_MAX + 1]; // +1 for '\0'
            realpath(entry->d_name, path);

            // Lấy toàn bộ thông tin của file dựa trên "stat"
            struct stat info;
            if(stat(path, &info) < 0) fprintf(stderr, " error\n");

            // In toàn bộ thông tin của File ra console
            printFile(info,entry->d_name);
        }
    }
  
    closedir(dir); 
}

char *permissions(__mode_t perm) {
    char *modeval = malloc (sizeof(char)*10);
    modeval[0] = (perm & S_IRUSR) ? 'r' : '-';
    modeval[1] = (perm & S_IWUSR) ? 'w' : '-';
    modeval[2] = (perm & S_IXUSR) ? 'x' : '-';
    modeval[3] = (perm & S_IRGRP) ? 'r' : '-';
    modeval[4] = (perm & S_IWGRP) ? 'w' : '-';
    modeval[5] = (perm & S_IXGRP) ? 'x' : '-';
    modeval[6] = (perm & S_IROTH) ? 'r' : '-';
    modeval[7] = (perm & S_IWOTH) ? 'w' : '-';
    modeval[8] = (perm & S_IXOTH) ? 'x' : '-';
    modeval[9] = '\0';
    return modeval;     
}

char *filetype(__mode_t perm) {
    char *typeval = malloc (sizeof(char)*2); 
    switch (perm & __S_IFMT) 
    {
        case __S_IFBLK:  typeval[0] = 'b';   break;
        case __S_IFCHR:  typeval[0] = 'c';   break;
        case __S_IFDIR:  typeval[0] = 'd';   break;
        case __S_IFIFO:  typeval[0] = 'p';   break;
        case __S_IFLNK:  typeval[0] = 'l';   break;
        case __S_IFREG:  typeval[0] = '-';   break;
        case __S_IFSOCK: typeval[0] = 's';   break;
        default:         typeval[0] = '-';   break;
    }
    typeval[1] = '\0';
    return typeval;
}

char *add0WhenBelow10(int val) {
    char *re = malloc (sizeof(char)*3);

    if (val<10) sprintf(re, "0%d", val);
    else sprintf(re, "%d", val);
    re[2] = '\0';

    return re;
}

char *getDateTime(__time_t dt) {
    char *result = malloc (sizeof(char)*14); 
    struct tm *t = localtime(&dt);

    sprintf(result, "Th%s %2d %s:%s", add0WhenBelow10(t->tm_mon+1), t->tm_mday, add0WhenBelow10(t->tm_hour), add0WhenBelow10(t->tm_min));

    result[13] = '\0';
    return result;
}

void printFileNameColor(char filename[256], __mode_t perm) {
    switch (perm & __S_IFMT) 
    {
        case __S_IFBLK:  printf("\033[1;32m");   break;
        case __S_IFCHR:  printf("\033[1;33m");   break;
        case __S_IFDIR:  printf("\033[1;34m");   break;
        case __S_IFIFO:  printf("\033[1;35m");   break;
        case __S_IFLNK:  printf("\033[1;32m");   break;
        case __S_IFREG:  printf("\033[0m");      break;
        case __S_IFSOCK: printf("\033[1;31m");   break;
        default:         printf("\033[1;36m");   break;
    }
    printf("%s", filename);
    printf("\033[0m");
    printf("%c\n", S_ISDIR(perm)?'/':'\0');
}

void printFile(struct stat info, char filename[256]) {
    // Lấy tên File Owner và File Group dựa trên UID và GID.
    struct passwd *pw = getpwuid(info.st_uid);
    struct group  *gr = getgrgid(info.st_gid);

    // Lấy chuỗi permissions từ st_mode
    char *perm = permissions(info.st_mode);

    // Lấy kí tự filetype từ st_mode
    char *ftype = filetype(info.st_mode);

    // Lấy ngày giờ
    char *dt = getDateTime(info.st_mtime);

    // In kết quả
    printf("%s%s %5lu %15s %15s %15ld \t%s \t", ftype, perm, info.st_nlink, pw->pw_name, gr->gr_name, info.st_size, dt);
    printFileNameColor(filename, info.st_mode);

    // Giải phóng tất cả malloc
    free(perm);
    free(ftype);
    free(dt);
}


//==========================================================================
//MAIN FUNCTION
int main(void) {
    getTotalSize();     // Lấy tổng kích cỡ của block
    run_ls_l();         // Thực thi lệnh "ls -l" theo ngôn ngữ C
    return 0; 
}