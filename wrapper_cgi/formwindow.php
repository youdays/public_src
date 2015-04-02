<?php
    require_once('util.php');

    //id と passwordがセットされているか
    if(isset($_POST["id"]) && isset($_POST["password"])){
        $id=$_POST["id"];
        $password=$_POST["password"];
        //空文字チェック
        if($id != "" && $password != ""){
            //認証処理
            if(login($id,$password)){
                //cgiの呼び出し
                $command = '/var/www/html/mailconfig/wrapperreader.cgi '.$id;
                $output = array();
                $ret = null;
                exec($command,$output,$ret);

                session_start();
                $_SESSION["id"] = $_POST["id"];
                $_SESSION["password"] = $_POST["password"];
            }
            else{
                error("login_error");
            }
        }
    }else{
        error("id_error");
    }
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <script type="text/javascript" src="js/formcheck.js"></script>
        <title>設定編集フォーム</title>
    </head>
    <body>
        <h1 class="top">転送設定</h1>
            <form action="changeforward.php" method="POST">
                <textarea name="forwardAddress" id="forwardAddress" cols=50 rows=5><?php if($ret==0){ foreach($output as &$str){print $str."\n"; } unset($value); } ?></textarea>
                <br /><input type="submit" id="chforward" value="転送先変更の適用" />
                <div class="help">
                    <div>・転送先アドレス以外入力しないでください。</div>
                    <div>・不要な改行はこちらで削除します。</div>
                </div>
            </form>
        <h1 class="top">パスワード変更</h1>
        <form action="changepassword.php" method="POST">
            <table>
                <tr>
                    <td>現在のパスワード</td>
                    <td><input type="password" id="oldPassword" name="oldPassword" /></td>
                </tr>
                <tr>
                    <td>新しいパスワード</td>
                    <td><input type="password" id="newPassword" name="newPassword" /></td>
                </tr>
                <tr>
                    <td>新しいパスワード（再入力）</td>
                    <td><input type="password" id="newPasswordtmp" name="newPasswordtmp" /></td>
                </tr>
            </table>
            <input type="submit" id="chpassword" value="パスワード変更の適用" />
        </form>
    </body>
</html>
