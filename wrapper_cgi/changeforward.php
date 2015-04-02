<?php
    session_start();

    $id = $_SESSION["id"];
    $password = $_SESSION["password"];
    $forwardaddress = $_POST["forwardAddress"];

    require_once('util.php');

    $ret=null;
    if(isset($id) && isset($password) && isset($forwardaddress)){
        //ログインで最終確認
        if(login($id,$password)){
            //書き込み処理
            //$forwardaddress_tmp = str_replace("\n",'\t',$forwardaddress);
            $forwardaddress_tmp = preg_replace('/(\r\n)+|\r+|\n+/','\t',$forwardaddress);
            $command = '/var/www/html/mailconfig/wrapperwriter.cgi '.$id.' \''.$forwardaddress_tmp.'\'';
            $output = array();
            exec($command,$output,$ret);
            //書き込み成功したなら
            if($ret == 0){
                //読み込み処理
                $command = '/var/www/html/mailconfig/wrapperreader.cgi '.$id;
                $output = array();
                exec($command,$output,$ret);
            }
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
        <h1 class="top">転送設定変更</h1>
        <?php 
            if(isset($ret) && $ret == 0){
        ?>
            <div class="success">転送設定を変更しました</div>
            <textarea cols=50 rows=5><?php if($ret==0){ foreach($output as &$str){print $str."\n";} }?></textarea>
        <?php 
            }
            else { print $ret."<br />";
                print $command."<br />"; 
        ?>
            <div class="error">設定中にエラーが発生しました。<br />ログインからやり直してください</div>
        <?php
            }
        ?>
        <br />
        <a href="configtop.php">ログイン画面へ</a>
    </body>
</html>
