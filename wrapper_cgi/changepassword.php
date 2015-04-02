<?php
    session_start();

    require_once('util.php');

    $id = $_SESSION["id"];
    $password = $_POST["oldPassword"];
    $newpassword = $_POST["newPassword"];

    $ret = null;
    if(isset($id) && isset($password) && isset($newpassword)){
        if(login($id,$password)){
            $id = str_replace("'","'\''",$id);
            $password = str_replace("'","'\''",$password);
            $newpassword = str_replace("'","'\''",$newpassword);

            $command = "ldappasswd -h rose.cs.meiji.ac.jp -D 'uid=".$id.",ou=People,dc=sb,dc=cs,dc=meiji,dc=ac,dc=jp' -x -w '".$password."' -s \"".$newpassword."\" 'uid=".$id.",ou=People,dc=sb,dc=cs,dc=meiji,dc=ac,dc=jp'";
            $output = array();
            exec($command,$output,$ret);
        }
    }

    //セッションの破棄
    $_SESSION = array();
    session_destroy();

?>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>転送設定の変更結果</title>
    </head>
    <body>
        <h1 class="top">パスワード変更</h1>
        <?php 
            if(isset($ret) && $ret==0){
        ?>
            <div class="success">パスワードを変更しました</div>
        <?php 
            }
            else {
        ?>
            <div class="error">パスワード変更中にエラーが発生しました。<br />ログインからやり直してください</div>
        <?php
            }
        ?>
        <br />
        <a href="configtop.php">ログイン画面へ</a>
    </body>
</html>
