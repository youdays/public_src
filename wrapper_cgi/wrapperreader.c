#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pwd.h>
#include <sys/types.h>
#include <sys/stat.h>

/* phpコマンドの絶対パス */
#define PHP_COMMAND "/usr/bin/php"
/* .forwardを読み込むphpファイル */
#define PHP_FILE "/var/www/html/mailconfig/forwardreader.php"

/*
コンパイル後のバイナリデータの所有者をrootにする
コンパイル後のバイナリデータのパーミッションを4755にする
下のコマンドの通りに打てばいい
-------------------
gcc -o wrapperreader.cgi wrapperreader.c
chown root:root wrapperreader.cgijkkjjjk
chmod 4755 wrapperreader.cgi
-------------------
*/
int main(int argc, char *argv[])
{
    const char *const envp[]={NULL};
    struct passwd *p;
    uid_t uid;
    gid_t gid;

    /*引数チェック*/
    if(argc != 2){
        return 1;
    }
    /*ユーザ名で構造体を取得*/
    p = getpwnam(argv[1]);
    if(!p){
        return 2;
    }
    /*構造体からuidとgidパスワードを取得する*/
    uid = p->pw_uid;
    gid = p->pw_gid;

    /*root(uid=0)では操作させない*/
    if(uid == 0){
        return 3;
    }
    /*umaskの設定*/
    umask(0077); /* エラーチェック不要（できない） */

    /*指定したgidになる*/
    if(setgid(gid)){
        return 4;
    }
    /*指定したuidになる*/
    if(setuid(uid)){
        return 5;
    }
    /*実行する(指定したuid・gidが実行したことになる)*/
    execle(PHP_COMMAND,PHP_COMMAND,PHP_FILE,(char *)NULL,envp);
    /*正常に実行されるとここまできません。*/
    return 6;
}
